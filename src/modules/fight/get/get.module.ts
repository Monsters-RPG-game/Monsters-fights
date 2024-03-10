import { Module } from '@nestjs/common';
import GetFightService from './get.service';
import ActionModule from '../../action/action.module';
import LogModule from '../../log/log.module';
import StateModule from '../../state/state.module';
import FightModule from '../fight.module';

@Module({
  imports: [StateModule, FightModule, LogModule, ActionModule],
  providers: [GetFightService],
  exports: [GetFightService],
})
export default class AppModule {}
