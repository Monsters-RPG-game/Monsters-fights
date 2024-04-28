import GetLogsDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import ActionsController from '../../actions/controller';
import LogsController from '../../log/controller';
import Fight from '../model';
import Rooster from '../rooster';
import type { IGetLogsDto } from './types';
import type { EModules } from '../../../enums';
import type { IFullFightLogs } from '../types';

export default class Controller extends ControllerFactory<EModules.Fights> {
  private readonly _log: LogsController;
  private readonly _actions: ActionsController;

  constructor() {
    super(new Rooster(Fight));
    this._log = new LogsController();
    this._actions = new ActionsController();
  }

  private get logs(): LogsController {
    return this._log;
  }

  private get actions(): ActionsController {
    return this._actions;
  }

  async get(data: IGetLogsDto): Promise<IFullFightLogs | null> {
    const payload = new GetLogsDto(data);
    return this.prepareLogs(payload.id);
  }

  private async prepareLogs(id: string): Promise<IFullFightLogs> {
    const preparedLogs: IFullFightLogs = {
      logs: [],
      _id: id,
    };

    const logs = await this.logs.get(id);

    if (logs && logs?.logs.length > 0) {
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
