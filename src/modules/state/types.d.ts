import type { IStateEntity } from './entity';
import type mongoose from 'mongoose';

export interface IStateTeam {
  character: string;
  hp: number;
}

export interface IState extends IStateEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
