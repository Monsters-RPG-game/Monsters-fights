import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { IStateTeam } from './fight.entity';
import type { HydratedDocument } from 'mongoose';

@Schema()
export class State {
  @Prop({
    type: {
      teams: [
        {
          character: mongoose.Types.ObjectId,
          hp: Number,
        },
      ],
    },
    default: { teams: [] },
  })
  init: { teams: IStateTeam[] } = { teams: [] };

  @Prop({
    type: {
      teams: [
        {
          character: mongoose.Types.ObjectId,
          hp: Number,
        },
      ],
    },
    default: { teams: [] },
  })
  current: { teams: IStateTeam[] } = { teams: [] };
}

export type IState = HydratedDocument<State>;

export const StateSchema = SchemaFactory.createForClass(State);
