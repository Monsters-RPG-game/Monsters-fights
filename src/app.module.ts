import { Module } from '@nestjs/common';
import AppController from './app.controller';
import AppService from './app.service';
import BrokerModule from './connections/broker/broker.module';
import MongoModule from './connections/mongo/mongo.module';
import AttackController from './modules/fight/attack/attack.controller';
import AttackModule from './modules/fight/attack/attack.module';

@Module({
  imports: [BrokerModule, MongoModule, AttackModule],
  controllers: [AppController, AttackController],
  providers: [AppService],
})
export default class AppModule {}
