import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import LogRooster from './log.rooster';
import { Log, LogSchema } from './log.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [LogRooster],
  exports: [LogRooster],
})
export default class LogModule {}
