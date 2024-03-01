import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import mongoose from 'mongoose';
import AttackDto from './attack.dto';
import { EAction } from '../../../enums';
import { IncorrectAttackTarget, UserNotInFight } from '../../../errors';
import Log from '../../../tools/logger';
import DtoPipe from '../../../tools/pipes/dto.pipe';
import ActionsRooster from '../../action/action.rooster';
import LogRooster from '../../log/log.rooster';
import StateRooster from '../../state/state.rooster';
import StateService from '../../state/state.service';
import FightRooster from '../fight.rooster';
import type { IActionEntity } from '../../action/action.entity';
import type { ILogEntity } from '../../log/log.entity';
import type { IStateEntity } from '../../state/log.entity';
import type { IStateTeam } from '../../state/state.types';
import type { IFullFight } from '../fight.types';

@Injectable()
export default class AttackService {
  constructor(
    private readonly service: StateService,
    private readonly fightRooster: FightRooster,
    private readonly stateRooster: StateRooster,
    private readonly logRooster: LogRooster,
    private readonly actionsRooster: ActionsRooster,
  ) {
    //
  }

  async attack(
    @Payload(new DtoPipe(AttackDto)) payload: AttackDto,
    user: string,
  ): Promise<Omit<IActionEntity, '_id'>[]> {
    Log.log('Got new attack message in attack module:', payload);

    let fight = this.service.get(user) as IFullFight;

    if (!fight) {
      const dbFight = await this.fightRooster.getActiveByUser(user);
      if (!dbFight) throw new UserNotInFight();
      const dbState = await this.stateRooster.get(dbFight?.states);

      this.service.createFight({ ...dbFight, states: dbState as IStateEntity });
      fight = this.service.get(user) as IFullFight;
    }

    const actions: Omit<IActionEntity, '_id'>[] = [];
    const enemyTeam = fight.states.current.teams.find((t) => {
      const characters = t.map((ch) => ch.character.toString());
      return !characters.includes(user);
    }) as IStateTeam[];
    const playerTeam = fight.states.current.teams.find((t) => {
      const characters = t.map((ch) => ch.character.toString());
      return characters.includes(user);
    }) as IStateTeam[];

    const target = enemyTeam.find((e) => e.character.toString() === payload.target);
    const player = playerTeam.find((e) => e.character.toString() === user) as IStateTeam;
    if (!target) throw new IncorrectAttackTarget();

    // Hardcoded attack value
    target.hp = target.hp - 5;
    actions.push({
      character: new mongoose.Types.ObjectId(user),
      action: EAction.Attack,
      target: new mongoose.Types.ObjectId(target.character),
      value: -5,
    });

    const aliveEnemies = enemyTeam.filter((ch) => ch.hp > 0);
    if (aliveEnemies.length === 0) {
      Log.debug('Fight', 'All enemies dead');
      await this.finishFight(fight, actions, user);

      return actions;
    }

    aliveEnemies.forEach((e) => {
      // Attack player
      player.hp = player.hp - 2;
      actions.push({
        character: new mongoose.Types.ObjectId(e.character),
        action: EAction.Attack,
        target: new mongoose.Types.ObjectId(user),
        value: -2,
      });
    });

    if (player.hp <= 0) {
      Log.debug('Fight', 'Player dead');
      await this.finishFight(fight, actions, user);

      return actions;
    }

    const phase = await this.updateDependencies(fight, actions);
    await this.startNextPhase(fight._id.toString(), phase);
    return actions;
  }

  private async finishFight(fight: IFullFight, actions: Omit<IActionEntity, '_id'>[], user: string): Promise<void> {
    await this.updateDependencies(fight, actions);

    this.service.leaveFight({ user });
    await this.fightRooster.update(fight._id.toString(), { active: false });
  }

  private async updateDependencies(fight: IFullFight, actions: Omit<IActionEntity, '_id'>[]): Promise<number> {
    await this.stateRooster.update(fight.states._id.toString(), fight.states);
    const ids = await Promise.all(actions.map(async (a) => this.actionsRooster.add(a)));

    const fightLogs = (await this.logRooster.get(fight.log.toString())) as ILogEntity;
    await this.logRooster.update(fightLogs._id.toString(), {
      logs: [
        ...fightLogs.logs,
        {
          actions: ids,
          phase: fightLogs.logs.length + 1,
        },
      ],
    });
    return fightLogs.logs.length + 2;
  }

  private async startNextPhase(fight: string, nextPhase: number): Promise<void> {
    await this.fightRooster.update(fight, { phase: nextPhase });
  }
}
