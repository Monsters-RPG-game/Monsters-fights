import type { IStatsEntity } from './entity';
import type mongoose from 'mongoose';

export interface IStats extends IStatsEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
