import type { Fight } from './fight.schema';
import type { TypesOfClass } from '../../types';
import type mongoose from 'mongoose';

export type IFightEntity = TypesOfClass<Fight> & { _id: mongoose.Types.ObjectId; start: string; finish: string };
