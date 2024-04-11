import type { IActionEntity } from './entity';
import type mongoose from 'mongoose';

export interface IAction extends IActionEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
