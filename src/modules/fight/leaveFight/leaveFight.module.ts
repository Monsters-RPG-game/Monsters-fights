import { Module } from '@nestjs/common';
import LeaveFightService from './leaveFight.service';
import BrokerModule from '../../../connections/broker/broker.module';
import StateModule from '../../state/state.module';
import { Fight } from '../fight.schema';

@Module({
  imports: [Fight, BrokerModule, StateModule],
  providers: [LeaveFightService],
  exports: [LeaveFightService],
})
export default class LeaveFightModule {}
