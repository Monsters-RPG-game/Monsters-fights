import type mongoose from 'mongoose';

export interface IFightEntity {
  _id: string;
  log: mongoose.Types.ObjectId;
  states: mongoose.Types.ObjectId;
  attacker: mongoose.Types.ObjectId;
  active: boolean;
  phase: number;
  start: string;
  finish: string;
}
