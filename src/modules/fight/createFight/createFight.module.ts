import { Module } from '@nestjs/common';
import CreateFightService from './createFight.service';
import BrokerModule from '../../../connections/broker/broker.module';
import LogModule from '../../log/log.module';
import StateModule from '../../state/state.module';
import FightModule from '../fight.module';

@Module({
  imports: [BrokerModule, StateModule, FightModule, LogModule],
  providers: [CreateFightService],
  exports: [CreateFightService],
})
export default class CreateFightModule {}
