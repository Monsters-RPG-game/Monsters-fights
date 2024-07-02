import BaseAttackDto from './dto';
import { EAction, EFightStatus, ESkillsType } from '../../../enums';
import { IncorrectAttackTarget, SkillsNotFound, UserNotInFight } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Log from '../../../tools/logger';
import State from '../../../tools/state';
import ActionsController from '../../actions/controller';
import LogsController from '../../log/controller';
import StatesController from '../../state/controller';
import StatsController from '../../stats/controller';
import Fight from '../model';
import Rooster from '../rooster';
import { prepareFight, prepareStatsToSave } from '../utils';
import type { IBaseAttackDto, IBaseDamage } from './types';
import type { EModules } from '../../../enums';
import type { IActionEntity } from '../../actions/entity';
import type { ILogEntity } from '../../log/entity';
import type { IStateEntity } from '../../state/entity';
import type { IStateTeam } from '../../state/types';
import type { IFullFight } from '../types';

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

  async baseAttack(
    data: BaseAttackDto,
    userId: string,
  ): Promise<{ logs: Omit<IActionEntity, '_id'>[]; status: EFightStatus }> {
    const payload = new BaseAttackDto(data);
    Log.log('Attack', 'Got new attack:', payload.target);
    let fight = await State.redis.getFight(userId);
    if (!fight) {
      fight = await this.initializeFight(userId);
    }

    const actions: Omit<IActionEntity, '_id'>[] = [];

    const enemyTeam = fight.states.current.enemy;
    const playerTeam = fight.states.current.attacker;

    const player = playerTeam[0]!;

    let target: IStateTeam | undefined;
    // const target = fight.states.current.enemy.find((e) => e.character._id.toString() === payload.target);
    // if (!target) throw new IncorrectAttackTarget();
    /**
     * actionValue is a return value of an action
     * for example: attack return amount of damage, support return amount of healed hp
     */
    let actionValue: number = 0;
    switch (payload.type) {
      case ESkillsType.Attack:
        target = fight.states.current.enemy.find((e) => e.character._id.toString() === payload.target);
        if (!target) throw new IncorrectAttackTarget();
        actionValue = await this.attackAction(data, enemyTeam, playerTeam);
        actions.push({
          character: userId,
          action: EAction.Attack,
          target: target.character._id,
          value: -actionValue,
        });
        break;

      case ESkillsType.Support:
        target = fight.states.current.attacker.find((e) => e.character._id.toString() === payload.target);
        if (!target) throw new IncorrectAttackTarget();
        actionValue = await this.supportAction(data, playerTeam);
        actions.push({
          character: userId,
          action: EAction.Skill,
          target: target.character._id,
          value: actionValue,
        });
        break;
      default:
        Log.log('Fight', 'no action specified');
    }

    const aliveEnemies = this.checkAliveEnemies(enemyTeam);
    if (aliveEnemies.length === 0) {
      Log.debug('Fight', 'All enemies dead');
      await this.finishFight(fight, actions, userId);

      return { logs: actions, status: EFightStatus.Win };
    }

    await this.enemyLoop({
      playerTeam,
      enemyTeam,
      actions,
    });

    if (player.character.stats.hp <= 0) {
      Log.debug('Fight', 'Player dead');
      await this.finishFight(fight, actions, userId);

      return { logs: actions, status: EFightStatus.Lose };
    }

    const phase = await this.updateDependencies(fight, actions);
    await this.startNextPhase(fight._id.toString(), phase);
    await State.redis.updateFight(fight.attacker, fight);

    return { logs: actions, status: EFightStatus.Ongoing };
  }

  private async attackAction(data: IBaseAttackDto, enemyTeam: IStateTeam[], playerTeam: IStateTeam[]): Promise<number> {
    const player = playerTeam[0]!;
    const target = enemyTeam.find((e) => e.character._id === data.target);
    if (!target) throw new IncorrectAttackTarget();

    const playermodifier = this.calculateModifiers(
      data.externalPower,
      player.character.stats.strength,
      target.character.stats.strength,
    );
    const playerdamage = this.calculateBaseMeleeDamage(player.character.stats.strength, playermodifier);

    // player attack
    await this.applyDamage(target, playerdamage!);
    return playerdamage!.dmg;
  }

  private async supportAction(data: IBaseAttackDto, playerTeam: IStateTeam[]): Promise<number> {
    const player = playerTeam.find((e) => e.character._id === data.target);
    if (!player) throw new IncorrectAttackTarget();
    const { skill } = data;
    // change errro
    if (!skill) throw new SkillsNotFound();
    const newHp = player.character.stats.hp + skill.power;
    await this.stats.rooster.update(player.stats, {
      stats: { ...player.character.stats, hp: newHp },
    });
    const testmsg = `Healed: [${skill.power}] hp of character: [${player.character._id}]`;
    Log.log('Support', testmsg);
    return skill.power;
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

  /** for now we base our calculation on strength difference, later we will change this to some
   * stat like str to defence/endurance etc
   * itemPower for now is 1, later we can add equipment with some stats that will increase modifier to damage
   */
  private calculateModifiers(itemPower: number | undefined = 1, attackerStr: number, targetStr: number): number {
    let mod = 0;
    if (attackerStr > targetStr) {
      mod += attackerStr - targetStr;
    }
    mod += itemPower;
    return mod;
  }
  private checkAliveEnemies(enemy: IStateTeam[]): IStateTeam[] {
    return enemy.filter((e) => {
      return e.character.stats.hp > 0;
    });
  }

  /** base damage is sum of strength and modifier (which is difference between attacker and target strength)
   * later we can another type of damage like ranged,magic etc
   */
  private calculateBaseMeleeDamage(str: number, modifier: number): IBaseDamage | undefined {
    const dmg: IBaseDamage = {
      dmg: str + modifier,
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
    enemyTeam,
    playerTeam,
    actions,
  }: {
    enemyTeam: IStateTeam[];
    playerTeam: IStateTeam[];
    actions: Omit<IActionEntity, '_id'>[];
  }): Promise<void> {
    const targetCharacter = playerTeam[0]!;

    const promises = enemyTeam.map(async (e) => {
      const mod = this.calculateModifiers(1, e.character.stats.strength, targetCharacter.character.stats.strength);
      const enemyDamage = this.calculateBaseMeleeDamage(targetCharacter.character.stats.strength, mod);
      await this.applyDamage(targetCharacter, enemyDamage!);
      const data: IBaseAttackDto = {
        target: targetCharacter.character._id,
        type: ESkillsType.Attack,
      };
      const actionValue = await this.attackAction(data, playerTeam, enemyTeam);
      actions.push({
        character: e.character._id,
        action: EAction.Attack,
        target: targetCharacter.character._id,
        value: -actionValue,
      });
    });

    await Promise.all(promises);
  }

  private async initializeFight(userId: string): Promise<IFullFight> {
    const dbFight = await this.rooster.getActiveByUser(userId);
    if (!dbFight) throw new UserNotInFight();
    const dbState = await this.states.get(dbFight?.states);
    const characters: string[] = [];

    dbState?.current.attacker.forEach((a) => {
      characters.push(a.character);
    });

    dbState?.current.enemy.forEach((a) => {
      characters.push(a.character);
    });

    const dbStats = await this.stats.getMany({ characters });
    const prepared = prepareFight(dbFight, dbState as IStateEntity, dbStats);
    await State.redis.addFight(userId, prepared);
    return prepared;
  }
}
