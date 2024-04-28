import type { EModules } from '../../enums';
import type ActionsController from '../../modules/actions/controller/';
import type { ICreateActionDto } from '../../modules/actions/create/types';
import type { IActionEntity } from '../../modules/actions/entity';
import type ActionsRooster from '../../modules/actions/rooster';
import type { IFightEntity } from '../../modules/fights/entity';
import type FightsController from '../../modules/fights/get/';
import type FightsRooster from '../../modules/fights/rooster';
import type LogsController from '../../modules/log/controller/';
import type { ILogEntity } from '../../modules/log/entity';
import type LogsRooster from '../../modules/log/rooster';
import type StatesController from '../../modules/state/controller/';
import type { ICreateStateDto } from '../../modules/state/create/types';
import type { IStateEntity } from '../../modules/state/entity';
import type StatesRooster from '../../modules/state/rooster';
import type StatsController from '../../modules/stats/controller/';
import type { ICreateStatsDto } from '../../modules/stats/create/types';
import type { IStatsEntity } from '../../modules/stats/entity';
import type StatsRooster from '../../modules/stats/rooster';

export interface IModulesHandlers {
  [EModules.Fights]: FightsController;
  [EModules.Logs]: LogsController;
  [EModules.States]: StatesController;
  [EModules.Actions]: ActionsController;
  [EModules.Stats]: StatsController;
}

export interface IModulesControllers {
  [EModules.Fights]: FightsRooster;
  [EModules.Logs]: LogsRooster;
  [EModules.States]: StatesRooster;
  [EModules.Actions]: ActionsRooster;
  [EModules.Stats]: StatsRooster;
}

export interface IRoosterAddData {
  [EModules.Fights]: Omit<IFightEntity, '_id' | 'start' | 'finish'>;
  [EModules.Logs]: Omit<ILogEntity, '_id'>;
  [EModules.States]: ICreateStateDto;
  [EModules.Actions]: ICreateActionDto;
  [EModules.Stats]: ICreateStatsDto;
}

export interface IRoosterGetData {
  [EModules.Fights]: IFightEntity;
  [EModules.Logs]: ILogEntity;
  [EModules.States]: IStateEntity;
  [EModules.Actions]: IActionEntity;
  [EModules.Stats]: IStatsEntity;
}

export interface IRoosterGetAllData {
  [EModules.Fights]: IFightEntity[];
  [EModules.Logs]: ILogEntity[];
  [EModules.States]: IStateEntity[];
  [EModules.Actions]: IActionEntity[];
  [EModules.Stats]: IStatsEntity[];
}

export interface IRoosterUpdate {
  [EModules.Fights]: Partial<IFightEntity>;
  [EModules.Logs]: Partial<ILogEntity>;
  [EModules.States]: Partial<IStateEntity>;
  [EModules.Actions]: Partial<IActionEntity>;
  [EModules.Stats]: Partial<IStatsEntity>;
}

interface IRoosterFactory<Z extends EModules> {
  add(data: IRoosterAddData[Z]): Promise<string>;

  get(data: unknown): Promise<IRoosterGetData[Z] | null>;

  getAll(page: number): Promise<IRoosterGetAllData[Z]>;

  update(id: string, data: unknown): Promise<void>;
}
