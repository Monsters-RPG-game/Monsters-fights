import type { IStateEntity } from './entity';
import type { IFightCharacterEntity } from '../../types/characters';
import type mongoose from 'mongoose';

export interface IStateTeam {
  character: IFightCharacterEntity;
  stats: string;
  hp: number;
}

export interface IStateBodyTeam {
  enemy: IStateTeam[];
  attacker: IStateTeam[];
}

export interface IFightState {
  _id: string;
  initialized: IStateBodyTeam;
  current: IStateBodyTeam;
}

export interface IState extends IStateEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
