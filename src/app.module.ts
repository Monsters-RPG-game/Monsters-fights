import { Module } from '@nestjs/common';
import AppController from './app.controller';
import AppService from './app.service';
import BrokerModule from './connections/broker/broker.module';
import MongoModule from './connections/mongo/mongo.module';
import AttackModule from './modules/fight/attack/attack.module';
import CreateFightModule from './modules/fight/createFight/createFight.module';
import GetFightModule from './modules/fight/get/get.module';
import GetLogsModule from './modules/fight/getLogs/getLogs.module';
import LeaveFightModule from './modules/fight/leaveFight/leaveFight.module';

@Module({
  imports: [
    BrokerModule,
    MongoModule,
    AttackModule,
    CreateFightModule,
    LeaveFightModule,
    GetFightModule,
    GetLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
