import UseSkillDto from './dto';
import { EAction, EFightStatus } from '../../../enums';
import { IncorrectAttackTarget, SkillsNotFound } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Log from '../../../tools/logger';
import State from '../../../tools/state';
import ActionsController from '../../actions/controller';
import LogsController from '../../log/controller';
import StatesController from '../../state/controller';
import StatsController from '../../stats/controller';
import Fight from '../model';
import Rooster from '../rooster';
import { prepareStatsToSave } from '../utils';
import type { IBaseDamage, IUseSkillDto } from './types';
import type { EModules } from '../../../enums';
import type { IActionEntity } from '../../actions/entity';
import type { ILogEntity } from '../../log/entity';
import type { IStateTeam } from '../../state/types';
import type { IFullFight } from '../types';
import type { Omit } from 'yargs';

export default class Controller extends ControllerFactory<EModules.Fights> {
  private readonly _states: StatesController;

  private readonly _log: LogsController;

  private readonly _actions: ActionsController;
  private readonly _stats: StatsController;

  constructor() {
    super(new Rooster(Fight));
    this._states = new StatesController();
    this._log = new LogsController();
    this._actions = new ActionsController();
    this._stats = new StatsController();
  }

  private get states(): StatesController {
    return this._states;
  }

  private get logs(): LogsController {
    return this._log;
  }

  private get stats(): StatsController {
    return this._stats;
  }

  private get actions(): ActionsController {
    return this._actions;
  }

  async execute(
    data: IUseSkillDto,
    userId: string,
  ): Promise<{ logs: Omit<IActionEntity, '_id'>[]; status: EFightStatus }> {
    const payload = new UseSkillDto(data);
    Log.log('Attack', 'Using skill:', payload);
    const fight = await State.redis.getFight(userId);
    const skills = await State.redis.getSkills(userId);
    if (!skills) throw new SkillsNotFound();

    const actions: Omit<IActionEntity, '_id'>[] = [];
    const enemyTeam = fight!.states.current.enemy;
    const playerTeam = fight!.states.current.attacker;

    const player = playerTeam[0]!;
    const target = enemyTeam.find((e) => e.character._id.toString() === payload.target);
    if (!target) throw new IncorrectAttackTarget();

    const skillPower = skills.singleSkills.find((e) => e._id === data.skillId);

    const playerdamage = this.calculateBaseSkillDamage(player.character.stats.intelligence, skillPower!.power);

    // player attack
    await this.applyDamage(target, playerdamage);

    actions.push({
      character: userId,
      action: EAction.Skill,
      target: target.character._id,
      value: -playerdamage.dmg,
    });

    const aliveEnemies = this.checkAliveEnemies(enemyTeam);
    if (aliveEnemies.length === 0) {
      Log.debug('Fight', 'All enemies dead');
      await this.finishFight(fight!, actions, userId);

      return { logs: actions, status: EFightStatus.Win };
    }

    await this.enemyLoop({
      targetCharacter: playerTeam[0]!,
      actions,
      attackerTeam: enemyTeam,
    });

    if (player.character.stats.hp <= 0) {
      Log.debug('Fight', 'Player dead');
      await this.finishFight(fight!, actions, userId);

      return { logs: actions, status: EFightStatus.Lose };
    }

    const phase = await this.updateDependencies(fight!, actions);
    await this.startNextPhase(fight!._id.toString(), phase);
    await State.redis.updateFight(fight!.attacker, fight!);

    return { logs: actions, status: EFightStatus.Ongoing };
  }

  private async finishFight(fight: IFullFight, actions: Omit<IActionEntity, '_id'>[], user: string): Promise<void> {
    await this.updateDependencies(fight, actions);

    await State.redis.removeFight(user);
    await this.rooster.update(fight._id.toString(), { active: false });
  }

  private async updateDependencies(fight: IFullFight, actions: Omit<IActionEntity, '_id'>[]): Promise<number> {
    await this.states.update(fight.states._id.toString(), prepareStatsToSave(fight.states));
    const ids = await Promise.all(actions.map(async (a) => this.actions.add(a)));

    const fightLogs = (await this.logs.get(fight.log.toString())) as ILogEntity;
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

  private checkAliveEnemies(enemy: IStateTeam[]): IStateTeam[] {
    return enemy.filter((e) => {
      return e.character.stats.hp > 0;
    });
  }

  /** base damage is sum of strength and modifier (which is difference between attacker and target strength)
   * later we can another type of damage like ranged,magic etc
   */
  private calculateBaseSkillDamage(int: number, modifier: number): IBaseDamage {
    const dmg: IBaseDamage = {
      dmg: int + modifier,
    };
    return dmg;
  }

  private async applyDamage(char: IStateTeam, base: IBaseDamage): Promise<void> {
    const newHp = char.character.stats.hp - base.dmg;
    await this.stats.rooster.update(char.stats, {
      stats: { ...char.character.stats, hp: newHp },
    });
    const testmsg = `applied: [${base.dmg}] dmg to character: [${char.character._id}]`;
    Log.log('Attack', testmsg);
  }

  private async enemyLoop({
    attackerTeam,
    targetCharacter,
    actions,
  }: {
    attackerTeam: IStateTeam[];
    actions: Omit<IActionEntity, '_id'>[];
    targetCharacter: IStateTeam;
  }): Promise<void> {
    const targetCharacterId = targetCharacter.character._id;

    const promises = attackerTeam.map(async (e) => {
      const enemyDamage = this.calculateBaseSkillDamage(targetCharacter.character.stats.intelligence,0);
      await this.applyDamage(targetCharacter, enemyDamage);
      actions.push({
        character: e.character._id,
        action: EAction.Skill,
        target: targetCharacterId,
        value: -enemyDamage.dmg,
      });
    });

    await Promise.all(promises);
  }
}
