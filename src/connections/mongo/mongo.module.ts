import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import getConfig from '../../tools/configLoader';

@Module({
  imports: [
    MongooseModule.forRoot(getConfig().mongoURI, {
      dbName: 'Fights',
    }),
  ],
  providers: [],
  exports: [],
})
export default class MongoModule {}
