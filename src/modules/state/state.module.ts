import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import StateRooster from './state.rooster';
import { State, StateSchema } from './state.schema';
import StateService from './state.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: State.name, schema: StateSchema }])],
  providers: [StateService, StateRooster],
  exports: [StateService, StateRooster],
})
export default class StateModule {}
