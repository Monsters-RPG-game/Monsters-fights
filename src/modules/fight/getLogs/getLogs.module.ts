import { Module } from '@nestjs/common';
import AttackService from './getLogs.service';
import ActionModule from '../../action/action.module';
import LogModule from '../../log/log.module';

@Module({
  imports: [ActionModule, LogModule],
  providers: [AttackService],
  exports: [AttackService],
})
export default class AppModule {}
