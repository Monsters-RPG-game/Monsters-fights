import { Module } from '@nestjs/common';
import LeaveFightService from './leaveFight.service';
import StateModule from '../../state/state.module';
import FightModule from '../fight.module';

@Module({
  imports: [StateModule, FightModule],
  providers: [LeaveFightService],
  exports: [LeaveFightService],
})
export default class LeaveFightModule {}
