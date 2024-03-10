import type { IFightEntity } from './fight.entity';
import type { IActionEntity } from '../action/action.entity';
import type { ILogEntity } from '../log/log.entity';
import type { IStateEntity } from '../state/log.entity';

export interface IFullFightLogs extends ILogEntity {
  logs: { phase: number; actions: IActionEntity[] }[];
}

export interface IFullFight extends IFightEntity {
  states: IStateEntity;
}

export interface IFightReport extends IFightEntity {
  states: IStateEntity;
  log: IFullFightLogs;
}
