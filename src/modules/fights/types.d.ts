import type { IFightEntity } from './entity';
import type { IActionEntity } from '../actions/entity';
import type { ILogEntity } from '../log/entity';
import type { IStateEntity } from '../state/entity';
import type mongoose from 'mongoose';

export interface IFullFightLogs extends ILogEntity {
  logs: { phase: number; actions: IActionEntity[] }[];
}

export interface IFullFight extends IFightEntity {
  _id: string;
  states: IStateEntity;
  start: string;
  finish: string;
}

export interface IFightReport extends IFightEntity {
  states: IStateEntity;
  log: IFullFightLogs;
}

export interface IFight extends IFightEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
