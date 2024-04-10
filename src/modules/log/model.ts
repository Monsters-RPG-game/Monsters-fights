import mongoose from 'mongoose';
import { EDbCollections } from '../../enums';
import type { ILog } from './types';

export const logBodySchema = new mongoose.Schema(
  {
    phase: {
      type: Number,
      required: [false, 'Phase not provided'],
    },
    actions: {
      type: [String],
      required: [true, 'Actions not provided'],
    },
  },
  { timestamps: false, _id: false },
);

export const logSchema = new mongoose.Schema({
  logs: {
    type: [logBodySchema],
    required: false,
    default: [],
  },
});

const Log = mongoose.model<ILog>('Log', logSchema, EDbCollections.Log);
export default Log;
