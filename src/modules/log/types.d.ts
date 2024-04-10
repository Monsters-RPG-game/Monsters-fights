import type { ILogEntity } from './entity';
import type mongoose from 'mongoose';

export interface ILog extends ILogEntity, mongoose.Document {
  _id: string;
}
