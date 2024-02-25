import { Module } from '@nestjs/common';
import CreateFightService from './createFight.service';
import BrokerModule from '../../../connections/broker/broker.module';
import StateModule from '../../state/state.module';
import { Fight } from '../fight.schema';

@Module({
  imports: [Fight, BrokerModule, StateModule],
  providers: [CreateFightService],
  exports: [CreateFightService],
})
export default class CreateFightModule {}
