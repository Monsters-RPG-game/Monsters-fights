import { Module } from '@nestjs/common';
import LeaveFightService from './leaveFight.service';
import ActionModule from '../../action/action.module';
import StateModule from '../../state/state.module';
import FightModule from '../fight.module';

@Module({
  imports: [StateModule, FightModule, ActionModule],
  providers: [LeaveFightService],
  exports: [LeaveFightService],
})
export default class LeaveFightModule {}
