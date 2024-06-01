import mongoose from 'mongoose';
import * as enums from '../../enums';
import type { IStats } from './types';

const characterStatsSchema = new mongoose.Schema(
  {
    strength: {
      type: Number,
      default: 1,
    },
    intelligence: {
      type: Number,
      default: 1,
    },
    hp: {
      type: Number,
      default: 10,
    },
  },
  { _id: false },
);

export const statsSchema = new mongoose.Schema(
  {
    character: {
      type: mongoose.Types.ObjectId,
      required: [true, 'character not provided'],
    },
    lvl: {
      type: Number,
      default: 1,
    },
    stats: {
      type: characterStatsSchema,
      required: [true, 'Character stats not provided'],
    },
  },
  { timestamps: true },
);

const Stats = mongoose.model<IStats>('Stat', statsSchema, enums.EDbCollections.Stats);
export default Stats;
