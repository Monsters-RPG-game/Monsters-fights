import CreateFightDto from './dto';
import { UserAlreadyInFight } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import State from '../../../tools/state';
import LogsController from '../../log/controller';
import SkillsController from '../../skills/controller';
import StatesController from '../../state/controller';
import StatsController from '../../stats/controller';
import CreateStatsDto from '../../stats/create/dto';
import Fight from '../model';
import Rooster from '../rooster';
import type { ICreateFightDto } from './types';
import type { EModules } from '../../../enums';
import type { ICreateStateBodyTeam } from '../../state/create/types';
import type { IStateBodyTeam, IStateTeam } from '../../state/types';
import type { IFightEntity } from '../entity';
import type { Omit } from 'yargs';

export default class Controller extends ControllerFactory<EModules.Fights> {
  private readonly _state: StatesController;
  private readonly _skills: SkillsController;
  private readonly _log: LogsController;
  private readonly _stats: StatsController;

  constructor() {
    super(new Rooster(Fight));
    this._state = new StatesController();
    this._log = new LogsController();
    this._stats = new StatsController();
    this._skills = new SkillsController();
  }

  private get state(): StatesController {
    return this._state;
  }

  private get stats(): StatsController {
    return this._stats;
  }

  private get logs(): LogsController {
    return this._log;
  }

  public get skills(): SkillsController {
    return this._skills;
  }

  async createFight(data: ICreateFightDto): Promise<void> {
    const payload = new CreateFightDto(data);

    const cachedFight = await State.redis.getFight(payload.attacker._id);
    if (cachedFight) throw new UserAlreadyInFight();
    const dbFight = await this.rooster.getActiveByUser(payload.attacker._id);
    if (dbFight) throw new UserAlreadyInFight();

    const state: IStateBodyTeam = {
      enemy: payload.teams
        .map((t) => {
          return t.map((character) => {
            return { character: character.character, stats: '' } as IStateTeam;
          });
        })
        .flat(),
      attacker: [],
    };
    state.attacker = [{ character: payload.attacker, stats: '' }];

    const preparedState = await this.prepareState(state);

    state.attacker = state.attacker.map((a) => {
      const character = preparedState.attacker.find((t) => t.character === a.character._id);
      return { ...a, stats: character!.stats };
    });
    state.enemy = state.enemy.map((a) => {
      const character = preparedState.enemy.find((t) => t.character === a.character._id);
      return { ...a, stats: character!.stats };
    });

    const states = await this.state.add({
      initialized: preparedState,
      current: preparedState,
    });

    await this.skills.add({
      owner: payload.skills.owner,
      singleSkills: payload.skills.singleSkills,
    });
    const log = await this.logs.addBasic();
    const now = new Date().toISOString();

    const fight: Omit<IFightEntity, '_id'> = {
      active: true,
      attacker: payload.attacker._id,
      log,
      states,
      phase: 1,
      start: now,
      finish: now,
    };
    const fightId = await this.rooster.add(fight as Omit<IFightEntity, '_id' | 'start' | 'finish'>);

    await State.redis.addFight(payload.attacker._id, {
      ...fight,
      states: {
        initialized: state,
        current: state,
        _id: states,
      },
      _id: fightId,
    });
  }

  private async getStats(team: IStateTeam[]): Promise<{ id: string; character: string }[]> {
    return Promise.all(
      team.map(async (ch) => {
        const payload = new CreateStatsDto({
          lvl: ch.character.lvl,
          character: ch.character._id,
          stats: ch.character.stats,
        });

        return { id: await this.stats.add(payload), character: ch.character._id };
      }),
    );
  }

  private async prepareState(team: IStateBodyTeam): Promise<ICreateStateBodyTeam> {
    const prepared: ICreateStateBodyTeam = { enemy: [], attacker: [] };
    const attackerStats = await this.getStats(team.attacker);
    const enemyStats = await this.getStats(team.enemy);

    team.enemy.forEach((e) => {
      prepared.enemy.push({
        ...e,
        stats: enemyStats.find((ch) => ch.character === e.character._id)!.id,
        character: e.character._id,
      });
    });
    team.attacker.forEach((e) => {
      prepared.attacker.push({
        ...e,
        stats: attackerStats.find((ch) => ch.character === e.character._id)!.id,
        character: e.character._id,
      });
    });

    return prepared;
  }
}
