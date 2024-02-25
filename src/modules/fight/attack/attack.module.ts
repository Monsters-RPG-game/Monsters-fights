import { Module } from '@nestjs/common';
import AttackService from './attack.service';
import BrokerModule from '../../../connections/broker/broker.module';
import StateModule from '../../state/state.module';
import FightModule from '../fight.module';

@Module({
  imports: [BrokerModule, StateModule, FightModule],
  providers: [AttackService],
  exports: [AttackService],
})
export default class AppModule {}
