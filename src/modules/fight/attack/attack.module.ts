import { Module } from '@nestjs/common';
import AttackService from './attack.service';
import BrokerModule from '../../../connections/broker/broker.module';

@Module({
  imports: [BrokerModule],
  providers: [AttackService],
  exports: [AttackService],
})
export default class AppModule {}
