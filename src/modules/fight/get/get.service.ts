import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import mongoose from 'mongoose';
import GetFightDto from './get.dto';
import { UserNotInFight } from '../../../errors';
import DtoPipe from '../../../tools/pipes/dto.pipe';
import ActionsRooster from '../../action/action.rooster';
import LogRooster from '../../log/log.rooster';
import StateRooster from '../../state/state.rooster';
import StateService from '../../state/state.service';
import FightRooster from '../fight.rooster';
import type { ILogEntity } from '../../log/log.entity';
import type { IStateEntity } from '../../state/log.entity';
import type { IFightReport, IFullFight, IFullFightLogs } from '../fight.types';

@Injectable()
export default class GetFightService {
  constructor(
    private readonly service: StateService,
    private readonly fightRooster: FightRooster,
    private readonly stateRooster: StateRooster,
    private readonly logRooster: LogRooster,
    private readonly actionsRooster: ActionsRooster,
  ) {
    //
  }

  async get(@Payload(new DtoPipe(GetFightDto)) payload: GetFightDto): Promise<IFightReport[]> {
    if (payload.active) {
      const fight = this.service.get(payload.owner) as IFullFight;

      if (!fight) {
        const dbFight = await this.fightRooster.getActiveByUser(payload.owner);

        if (!dbFight) throw new UserNotInFight();
        const dbState = await this.stateRooster.get(dbFight?.states);
        const logs = await this.prepareLogs(dbFight.log._id.toString());

        return [{ ...dbFight, states: dbState as IStateEntity, log: logs }];
      }

      const dbState = await this.stateRooster.get(fight?.states);
      const logs = await this.prepareLogs(fight.log._id.toString());

      return [{ ...fight, states: dbState as IStateEntity, log: logs }];
    }

    const prepared: IFightReport[] = [];

    const dbFight = await this.fightRooster.getByUser(payload.owner, payload.page);
    if (dbFight.length === 0) return [];

    const dbState = await this.stateRooster.getMany(dbFight.map((f) => f.states.toString()));
    const logs = await Promise.all(dbFight.map(async (f) => this.prepareLogs(f.log.toString())));

    dbFight.forEach((f) => {
      prepared.push({
        ...f,
        states: dbState.find((s) => s._id.toString() === f.states.toString()),
        log: logs.find((l) => l._id.toString() === f.log.toString()),
      } as IFightReport);
    });

    return prepared;
  }

  private async prepareLogs(id: string): Promise<IFullFightLogs> {
    const preparedLogs: IFullFightLogs = {
      logs: [],
      _id: new mongoose.Types.ObjectId(id),
    };

    const logs = (await this.logRooster.get(id)) as ILogEntity;

    if (logs.logs.length > 0) {
      preparedLogs.logs = await Promise.all(
        logs.logs.map(async (l) => {
          return {
            phase: l.phase,
            actions: await this.actionsRooster.getMany(l.actions),
          };
        }),
      );
    }

    return preparedLogs;
  }
}
