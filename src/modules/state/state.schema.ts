import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { IStateTeam } from './state.types';

@Schema()
export class State {
  @Prop({
    _id: false,
    type: {
      teams: [
        [
          {
            _id: false,
            character: mongoose.Types.ObjectId,
            hp: Number,
          },
        ],
      ],
    },
    default: { teams: [] },
  })
  initialized: { teams: IStateTeam[][] } = { teams: [] };

  @Prop({
    type: {
      _id: false,
      teams: [
        [
          {
            _id: false,
            character: mongoose.Types.ObjectId,
            hp: Number,
          },
        ],
      ],
    },
    default: { teams: [] },
  })
  current: { teams: IStateTeam[][] } = { teams: [] };
}

export const StateSchema = SchemaFactory.createForClass(State);
