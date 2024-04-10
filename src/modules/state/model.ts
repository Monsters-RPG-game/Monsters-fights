import mongoose from 'mongoose';
import { EDbCollections } from '../../enums';
import type { IState } from './types';

export const stateBody = new mongoose.Schema(
  {
    character: {
      type: mongoose.Types.ObjectId,
      required: [false, 'Character not provided'],
    },
    hp: {
      type: Number,
      required: [true, 'Hp not provided'],
    },
  },
  { timestamps: false, _id: false },
);

export const stateTeamBody = new mongoose.Schema(
  {
    teams: {
      type: [stateBody],
      default: [],
    },
  },
  { timestamps: false, _id: false },
);

export const stateSchema = new mongoose.Schema({
  initialized: {
    type: [stateTeamBody],
    default: [],
  },
  current: {
    type: [stateTeamBody],
    default: [],
  },
});

const State = mongoose.model<IState>('State', stateSchema, EDbCollections.State);
export default State;
