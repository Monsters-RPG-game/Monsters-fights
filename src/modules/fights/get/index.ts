import GetFightDto from './dto';
import { UserNotInFight } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import State from '../../../tools/state';
import ActionsController from '../../actions/controller';
import LogsController from '../../log/controller';
import StatesController from '../../state/controller';
import Fight from '../model';
import Rooster from '../rooster';
import type { IGetFightDto } from './types';
import type { EModules } from '../../../enums';
import type { ILogEntity } from '../../log/entity';
import type { IStateEntity } from '../../state/entity';
import type { IFightReport, IFullFight, IFullFightLogs } from '../types';

export default class Controller extends ControllerFactory<EModules.Fights> {
  private readonly _state: StatesController;
  private readonly _log: LogsController;
  private readonly _actions: ActionsController;

  constructor() {
    super(new Rooster(Fight));
    this._state = new StatesController();
    this._log = new LogsController();
    this._actions = new ActionsController();
  }

  private get state(): StatesController {
    return this._state;
  }

  private get logs(): LogsController {
    return this._log;
  }

  private get actions(): ActionsController {
    return this._actions;
  }

  async get(data: IGetFightDto): Promise<IFightReport[]> {
    const payload = new GetFightDto(data);
    return payload.active ? this.getActive(payload) : this.getInactive(payload);
  }

  private async getInactive(payload: GetFightDto): Promise<IFightReport[]> {
    const prepared: IFightReport[] = [];

    const dbFight = await this.rooster.getByUser(payload.owner, payload.page);
    if (dbFight.length === 0) return [];

    const dbState = await this.state.getManyFromDb(dbFight.map((f) => f.states.toString()));
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

  private async getActive(payload: GetFightDto): Promise<IFightReport[]> {
    const fight = State.cache.get(payload.owner) as IFullFight;

    if (!fight) {
      const dbFight = await this.rooster.getActiveByUser(payload.owner);

      if (!dbFight) throw new UserNotInFight();
      const dbState = await this.state.getFromDb(dbFight?.states.toString());
      const logs = await this.prepareLogs(dbFight.log);

      return [{ ...dbFight, _id: dbFight._id.toString(), states: dbState as IStateEntity, log: logs }];
    }

    const dbState = await this.state.getFromDb(fight?.states._id);
    const logs = await this.prepareLogs(fight.log);

    return [{ ...fight, _id: fight._id.toString(), states: dbState as IStateEntity, log: logs }];
  }

  private async prepareLogs(id: string): Promise<IFullFightLogs> {
    const preparedLogs: IFullFightLogs = {
      logs: [],
      _id: id,
    };

    const logs = (await this.logs.getFromDb(id)) as ILogEntity;

    if (logs.logs.length > 0) {
      preparedLogs.logs = await Promise.all(
        logs.logs.map(async (l) => {
          return {
            phase: l.phase,
            actions: await this.actions.getMany(l.actions),
          };
        }),
      );
    }

    return preparedLogs;
  }
}
