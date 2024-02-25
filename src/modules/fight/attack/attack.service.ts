import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import AttackDto from './attack.dto';
import { UserNotInFight } from '../../../errors';
import Log from '../../../tools/logger';
import DtoPipe from '../../../tools/pipes/dto.pipe';
import StateRooster from '../../state/state.rooster';
import StateService from '../../state/state.service';
import CreateFightDto from '../createFight/createFight.dto';
import FightRooster from '../fight.rooster';
import type { IStateTeam } from '../../state/state.types';

@Injectable()
export default class AttackService {
  constructor(
    private readonly service: StateService,
    private readonly fightRooster: FightRooster,
    private readonly stateRooster: StateRooster,
  ) {
    //
  }

  async attack(@Payload(new DtoPipe(AttackDto)) payload: AttackDto, user: string): Promise<void> {
    Log.log('Got new attack message in attack module:', payload);

    let fight = this.service.get(user);

    if (!fight) {
      const dbFight = await this.fightRooster.getActiveByUser(user);
      if (!dbFight) throw new UserNotInFight();
      const dbState = await this.stateRooster.get(dbFight?.states);

      this.service.createFight(
        new CreateFightDto({
          attacker: dbFight.attacker.toString(),
          teams: dbState?.current.teams as [IStateTeam[], IStateTeam[]],
        }),
      );
      fight = this.service.get(user);
    }

    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
