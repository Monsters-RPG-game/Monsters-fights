import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

export const LogSchema = SchemaFactory.createForClass(Log);
