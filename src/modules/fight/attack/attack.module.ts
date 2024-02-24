import { Module } from '@nestjs/common';
import AttackController from './attack.controller';
import AttackService from './attack.service';
import BrokerModule from '../../../connections/broker/broker.module';
import { Fight } from '../fight.schema';

@Module({
  imports: [Fight, BrokerModule],
  controllers: [AttackController],
  providers: [AttackService],
  exports: [AttackService],
})
export default class AppModule {}
