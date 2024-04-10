import type { EAction } from '../../enums';
import type mongoose from 'mongoose';

export interface IActionEntity {
  character: mongoose.Types.ObjectId;
  action: EAction;
  target: mongoose.Types.ObjectId;
  value: number;
}
