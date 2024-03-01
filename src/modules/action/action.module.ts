import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ActionRooster from './action.rooster';
import { Action, ActionSchema } from './action.schema';
import MongoModule from '../../connections/mongo/mongo.module';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      {
        name: Action.name,
        schema: ActionSchema,
      },
    ]),
  ],
  providers: [ActionRooster],
  exports: [ActionRooster],
})
export default class ActionModule {}
