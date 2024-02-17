import { Module } from '@nestjs/common';
import AppController from './app.controller';
import AppService from './app.service';
import BrokerModule from './connections/broker/broker.module';

@Module({
  imports: [BrokerModule],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
