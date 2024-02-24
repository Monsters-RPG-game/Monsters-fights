import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema()
export class Log {
  @Prop({
    type: [
      {
        phase: Number,
        actions: [String],
      },
    ],
    default: [],
  })
  logs: { phase: number; actions: string[] }[] = [];
}

export type ILog = HydratedDocument<Log>;

export const LogSchema = SchemaFactory.createForClass(Log);
