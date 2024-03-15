import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import GetFightDto from './get.dto';
import { UserNotInFight } from '../../../errors';
import DtoPipe from '../../../tools/pipes/dto.pipe';
import StateRooster from '../../state/state.rooster';
import StateService from '../../state/state.service';
import FightRooster from '../fight.rooster';
import FightsUtils from '../fights.utils';
import type { IStateEntity } from '../../state/log.entity';
import type { IFightReport, IFullFight } from '../fight.types';

@Injectable()
export default class GetFightService {
  constructor(
    private readonly service: StateService,
    private readonly fightRooster: FightRooster,
    private readonly stateRooster: StateRooster,
    private readonly fightUtils: FightsUtils,
  ) {
    //
  }

  async get(@Payload(new DtoPipe(GetFightDto)) payload: GetFightDto): Promise<IFightReport[]> {
    return payload.active ? this.getActive(payload) : this.getInactive(payload);
  }

  private async getInactive(payload: GetFightDto): Promise<IFightReport[]> {
    const prepared: IFightReport[] = [];

    const dbFight = await this.fightRooster.getByUser(payload.owner, payload.page);
    if (dbFight.length === 0) return [];

    const dbState = await this.stateRooster.getMany(dbFight.map((f) => f.states.toString()));
    const logs = await Promise.all(dbFight.map(async (f) => this.fightUtils.prepareLogs(f.log.toString())));

    dbFight.forEach((f) => {
      prepared.push({
        ...f,
        states: dbState.find((s) => s._id.toString() === f.states.toString()),
        log: logs.find((l) => l._id.toString() === f.log.toString()),
      } as IFightReport);
    });

    return prepared;
  }

  private async getActive(payload: GetFightDto): Promise<IFightReport[]> {
    const fight = this.service.get(payload.owner) as IFullFight;

    if (!fight) {
      const dbFight = await this.fightRooster.getActiveByUser(payload.owner);

      if (!dbFight) throw new UserNotInFight();
      const dbState = await this.stateRooster.get(dbFight?.states);
      const logs = await this.fightUtils.prepareLogs(dbFight.log._id.toString());

      return [{ ...dbFight, states: dbState as IStateEntity, log: logs }];
    }

    const dbState = await this.stateRooster.get(fight?.states);
    const logs = await this.fightUtils.prepareLogs(fight.log._id.toString());

    return [{ ...fight, states: dbState as IStateEntity, log: logs }];
  }
}
