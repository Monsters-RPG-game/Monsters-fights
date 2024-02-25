import { Module } from '@nestjs/common';
import MigrationService from './migration.service';
import MongoModule from '../connections/mongo/mongo.module';

@Module({
  imports: [MongoModule],
  controllers: [MigrationService],
  providers: [MigrationService],
})
export default class MigrationModule {}
