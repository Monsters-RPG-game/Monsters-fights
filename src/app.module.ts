import { Module } from '@nestjs/common';
import AppController from './app.controller';
import AppService from './app.service';
import BrokerModule from './broker/broker.module';

@Module({
  imports: [BrokerModule],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
