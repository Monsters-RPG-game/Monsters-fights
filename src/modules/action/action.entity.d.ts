import type { Action } from './action.schema';
import type { TypesOfClass } from '../../types';
import type mongoose from 'mongoose';

export type IActionEntity = TypesOfClass<Action> & { _id: mongoose.Types.ObjectId };
