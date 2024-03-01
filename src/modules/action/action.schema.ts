import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EAction } from '../../enums';

@Schema()
export class Action {
  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'character not provided'],
  })
  character: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();

  @Prop({
    type: String,
    enum: EAction,
    required: true,
  })
  action: EAction = EAction.Attack;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: [true, 'target not provided'],
  })
  target: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();

  @Prop({
    type: Number,
    required: [true, 'value not provided'],
  })
  value: number = 0;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
