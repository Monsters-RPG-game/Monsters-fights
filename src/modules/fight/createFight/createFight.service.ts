import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import mongoose from 'mongoose';
import CreateFightDto from './createFight.dto';
import { UserAlreadyInFight } from '../../../errors';
import DtoPipe from '../../../tools/pipes/dto.pipe';
import LogRooster from '../../log/log.rooster';
import StateRooster from '../../state/state.rooster';
import StateService from '../../state/state.service';
import FightRooster from '../fight.rooster';
import type { IStateTeam } from '../../state/state.types';

@Injectable()
export default class CreateFightService {
  constructor(
    private readonly service: StateService,
    private readonly fightRooster: FightRooster,
    private readonly stateRooster: StateRooster,
    private readonly logRooster: LogRooster,
  ) {
    //
  }

  async createFight(@Payload(new DtoPipe(CreateFightDto)) payload: CreateFightDto): Promise<void> {
    if (this.service.get(payload.attacker)) throw new UserAlreadyInFight();
    const data = await this.fightRooster.getActiveByUser(payload.attacker);
    if (data) throw new UserAlreadyInFight();

    const state = {
      teams: payload.teams.map((t) =>
        t.map((character) => {
          return { character: character.character, hp: 10 } as IStateTeam;
        }),
      ),
    };
    // Currently 'character' does not exist. Hardcoding value
    state.teams[0] = [{ character: payload.attacker, hp: 10 }];

    const states = await this.stateRooster.add(state);
    const log = await this.logRooster.addBasic();
    await this.fightRooster.add({
      active: true,
      attacker: new mongoose.Types.ObjectId(payload.attacker),
      log: new mongoose.Types.ObjectId(log),
      states: new mongoose.Types.ObjectId(states),
    });

    this.service.createFight(payload);
  }
}
