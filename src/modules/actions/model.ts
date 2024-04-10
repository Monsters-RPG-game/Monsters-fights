import mongoose from 'mongoose';
import * as enums from '../../enums';
import type { IAction } from './types';

export const actionsSchema = new mongoose.Schema(
  {
    character: {
      type: mongoose.Types.ObjectId,
      required: [true, 'character not provided'],
    },
    action: {
      type: String,
      enum: enums.EAction,
      required: true,
    },
    target: {
      type: mongoose.Types.ObjectId,
      required: [true, 'target not provided'],
    },
    value: {
      type: Number,
      required: [true, 'value not provided'],
    },
  },
  { timestamps: true },
);

const Action = mongoose.model<IAction>('Action', actionsSchema, enums.EDbCollections.Action);
export default Action;
