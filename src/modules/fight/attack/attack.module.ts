import { Module } from '@nestjs/common';
import AttackService from './attack.service';
import BrokerModule from '../../../connections/broker/broker.module';
import { Fight } from '../fight.schema';

@Module({
  imports: [Fight, BrokerModule],
  providers: [AttackService],
  exports: [AttackService],
})
export default class AppModule {}
