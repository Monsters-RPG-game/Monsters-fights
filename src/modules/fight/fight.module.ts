import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import FightRooster from './fight.rooster';
import { Fight, FightSchema } from './fight.schema';
import MongoModule from '../../connections/mongo/mongo.module';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      {
        name: Fight.name,
        schema: FightSchema,
      },
    ]),
  ],
  providers: [FightRooster],
  exports: [FightRooster],
})
export default class FightModule {}
