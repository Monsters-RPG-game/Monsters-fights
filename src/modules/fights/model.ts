import mongoose from 'mongoose';
import * as enums from '../../enums';
import type { IFight } from './types';

export const fightSchema = new mongoose.Schema(
  {
    log: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Log id not provided'],
      unique: true,
    },
    states: {
      type: mongoose.Types.ObjectId,
      required: [true, 'States id not provided'],
      unique: true,
    },
    attacker: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Attacker not provided'],
    },
    active: {
      type: Boolean,
      required: [true, 'Active not provided'],
      default: true,
    },
    phase: {
      type: Number,
      required: [true, 'phase not provided'],
      default: 1,
    },
  },
  { timestamps: true },
);

const Fight = mongoose.model<IFight>('Fight', fightSchema, enums.EDbCollections.Fight);
export default Fight;
