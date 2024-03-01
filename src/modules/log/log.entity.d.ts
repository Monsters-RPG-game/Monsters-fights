import type { Log } from './log.schema';
import type { TypesOfClass } from '../../types';
import type mongoose from 'mongoose';

export type ILogEntity = TypesOfClass<Log> & { _id: mongoose.Types.ObjectId };
