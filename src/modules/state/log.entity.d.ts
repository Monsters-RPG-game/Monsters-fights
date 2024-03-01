import type { State } from './state.schema';
import type { TypesOfClass } from '../../types';
import type mongoose from 'mongoose';

export type IStateEntity = TypesOfClass<State> & { _id: mongoose.Types.ObjectId };
