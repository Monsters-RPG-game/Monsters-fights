import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema()
export class Fight {
  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'Log id not provided'],
    unique: true,
  })
  log: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();

  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'States id not provided'],
    unique: true,
  })
  states: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();

  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'Attacker not provided'],
  })
  attacker: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();

  @Prop({
    type: Boolean,
    required: [true, 'Active not provided'],
    default: true,
  })
  active: boolean = true;
}

export type IFight = HydratedDocument<Fight>;

export const FightSchema = SchemaFactory.createForClass(Fight);
