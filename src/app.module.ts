import { Module } from '@nestjs/common';
import AppController from './app.controller';
import AppService from './app.service';
import BrokerModule from './connections/broker/broker.module';
import MongoModule from './connections/mongo/mongo.module';

@Module({
  imports: [BrokerModule, MongoModule],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
