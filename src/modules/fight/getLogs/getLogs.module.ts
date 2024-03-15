import { Module } from '@nestjs/common';
import AttackService from './getLogs.service';
import ActionModule from '../../action/action.module';
import LogModule from '../../log/log.module';
import FightsUtils from '../fights.utils';

@Module({
  imports: [ActionModule, LogModule],
  providers: [AttackService, FightsUtils],
  exports: [AttackService],
})
export default class AppModule {}
