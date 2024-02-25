import { Module } from '@nestjs/common';
import AppController from './app.controller';
import AppService from './app.service';
import BrokerModule from './connections/broker/broker.module';
import MongoModule from './connections/mongo/mongo.module';
import AttackModule from './modules/fight/attack/attack.module';
import CreateFightModule from './modules/fight/createFight/createFight.module';

@Module({
  imports: [BrokerModule, MongoModule, AttackModule, CreateFightModule],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
