import mongoose from 'mongoose';
import AttackDto from './dto';
import { EAction, EFightStatus } from '../../../enums';
import { IncorrectAttackTarget, UserNotInFight } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Log from '../../../tools/logger';
import ActionsController from '../../actions/controller';
import LogsController from '../../log/controller';
import StatesController from '../../state/controller';
import Fight from '../model';
import Rooster from '../rooster';
import type { IAttackDto } from './types';
import type { EModules } from '../../../enums';
import type { IActionEntity } from '../../actions/entity';
import type { ILogEntity } from '../../log/entity';
import type { IStateEntity } from '../../state/entity';
import type { IStateTeam } from '../../state/types';
import type { IFullFight } from '../types';
import type { Omit } from 'yargs';

export default class Controller extends ControllerFactory<EModules.Fights> {
  private readonly _states: StatesController;

  private readonly _log: LogsController;

  private readonly _actions: ActionsController;

  constructor() {
    super(new Rooster(Fight));
    this._states = new StatesController();
    this._log = new LogsController();
    this._actions = new ActionsController();
  }

  private get states(): StatesController {
    return this._states;
  }

  private get logs(): LogsController {
    return this._log;
  }

  private get actions(): ActionsController {
    return this._actions;
  }

  async attack(
    data: IAttackDto,
    userId: string,
  ): Promise<{ logs: Omit<IActionEntity, '_id'>[]; status: EFightStatus }> {
    const payload = new AttackDto(data);
    Log.log('Attack', 'Got new attack:', payload);

    let fight = this.states.get(userId);

    if (!fight) {
      const dbFight = await this.rooster.getActiveByUser(userId);
      if (!dbFight) throw new UserNotInFight();
      const dbState = await this.states.getFromDb(dbFight?.states._id.toString());

      this.states.createFight({ ...dbFight, states: dbState as IStateEntity });
      fight = this.states.get(userId) as IFullFight;
    }

    const actions: Omit<IActionEntity, '_id'>[] = [];
    const enemyTeam = fight.states.current.teams.find((t) => {
      const characters = t.map((ch) => ch.character.toString());
      return !characters.includes(userId);
    }) as IStateTeam[];
    const playerTeam = fight.states.current.teams.find((t) => {
      const characters = t.map((ch) => ch.character.toString());
      return characters.includes(userId);
    }) as IStateTeam[];

    const target = enemyTeam.find((e) => e.character.toString() === payload.target);
    const player = playerTeam.find((e) => e.character.toString() === userId) as IStateTeam;
    if (!target) throw new IncorrectAttackTarget();

    // Hardcoded attack value
    target.hp = target.hp - 5;
    actions.push({
      character: new mongoose.Types.ObjectId(userId),
      action: EAction.Attack,
      target: new mongoose.Types.ObjectId(target.character),
      value: -5,
    });

    const aliveEnemies = enemyTeam.filter((ch) => ch.hp > 0);
    if (aliveEnemies.length === 0) {
      Log.debug('Fight', 'All enemies dead');
      await this.finishFight(fight, actions, userId);

      return { logs: actions, status: EFightStatus.Win };
    }

    aliveEnemies.forEach((e) => {
      // Attack player
      player.hp = player.hp - 2;
      actions.push({
        character: new mongoose.Types.ObjectId(e.character),
        action: EAction.Attack,
        target: new mongoose.Types.ObjectId(userId),
        value: -2,
      });
    });

    if (player.hp <= 0) {
      Log.debug('Fight', 'Player dead');
      await this.finishFight(fight, actions, userId);

      return { logs: actions, status: EFightStatus.Lose };
    }

    const phase = await this.updateDependencies(fight, actions);
    await this.startNextPhase(fight._id.toString(), phase);
    return { logs: actions, status: EFightStatus.Ongoing };
  }

  private async finishFight(fight: IFullFight, actions: Omit<IActionEntity, '_id'>[], user: string): Promise<void> {
    await this.updateDependencies(fight, actions);

    this.states.leaveFight({ user });
    await this.rooster.update(fight._id.toString(), { active: false });
  }

  private async updateDependencies(fight: IFullFight, actions: Omit<IActionEntity, '_id'>[]): Promise<number> {
    await this.states.update(fight.states._id.toString(), fight.states);
    const ids = await Promise.all(actions.map(async (a) => this.actions.add(a)));

    const fightLogs = (await this.logs.getFromDb(fight.log.toString())) as ILogEntity;
    await this.logs.update(fightLogs._id.toString(), {
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
    await this.rooster.update(fight, { phase: nextPhase });
  }
}
