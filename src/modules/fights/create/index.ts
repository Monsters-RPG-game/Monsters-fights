import CreateFightDto from './dto';
import { UserAlreadyInFight } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import State from '../../../tools/state';
import LogsController from '../../log/controller';
import StatesController from '../../state/controller';
import Fight from '../model';
import Rooster from '../rooster';
import type { ICreateFightDto } from './types';
import type { EModules } from '../../../enums';
import type { IStateTeam } from '../../state/types';
import type { IFightEntity } from '../entity';
import type { Omit } from 'yargs';

export default class Controller extends ControllerFactory<EModules.Fights> {
  private readonly _state: StatesController;

  private readonly _log: LogsController;

  constructor() {
    super(new Rooster(Fight));
    this._state = new StatesController();
    this._log = new LogsController();
  }

  private get state(): StatesController {
    return this._state;
  }

  private get logs(): LogsController {
    return this._log;
  }

  async createFight(data: ICreateFightDto): Promise<void> {
    const payload = new CreateFightDto(data);

    if (State.cache.get(payload.attacker)) throw new UserAlreadyInFight();
    const dbFight = await this.rooster.getActiveByUser(payload.attacker);
    if (dbFight) throw new UserAlreadyInFight();

    const state = {
      teams: payload.teams.map((t) =>
        t.map((character) => {
          return { character: character.character, hp: 10 } as IStateTeam;
        }),
      ),
    };
    // Currently 'character' does not exist. Hardcoding value
    state.teams[0] = [{ character: payload.attacker, hp: 10 }];

    const states = await this.state.add(state);
    const log = await this.logs.addBasic();
    const now = new Date().toISOString();

    const fight: Omit<IFightEntity, '_id'> = {
      active: true,
      attacker: payload.attacker,
      log,
      states,
      phase: 1,
      start: now,
      finish: now,
    };
    const fightId = await this.rooster.add(fight as Omit<IFightEntity, '_id' | 'start' | 'finish'>);
    State.cache.create({
      ...fight,
      states: {
        initialized: structuredClone(state),
        current: structuredClone(state),
        _id: states,
      },
      _id: fightId,
    });
  }
}
