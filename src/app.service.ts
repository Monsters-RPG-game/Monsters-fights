import { Injectable } from '@nestjs/common';
import AttackDto from './modules/fight/attack/attack.dto';
import AttackService from './modules/fight/attack/attack.service';
import CreateFightDto from './modules/fight/createFight/createFight.dto';
import CreateFightService from './modules/fight/createFight/createFight.service';
import LeaveFightDto from './modules/fight/leaveFight/leaveFight.dto';
import LeaveFightService from './modules/fight/leaveFight/leaveFight.service';
import DtoPipe from './tools/pipes/dto.pipe';
import type { IActionEntity } from './modules/action/action.entity';
import type * as types from './types';

@Injectable()
export default class AppService {
  constructor(
    private readonly attackService: AttackService,
    private readonly createFightService: CreateFightService,
    private readonly leaveFightService: LeaveFightService,
  ) {
    //
  }

  async attack(payload: types.IRabbitMessage): Promise<Omit<IActionEntity, '_id'>[]> {
    const target = new DtoPipe(AttackDto);
    return this.attackService.attack(target.transform(payload.payload as AttackDto), payload.user.userId as string);
  }

  async createFight(payload: types.IRabbitMessage): Promise<void> {
    const target = new DtoPipe(CreateFightDto);
    await this.createFightService.createFight(target.transform(payload.payload as CreateFightDto));
  }

  async leave(payload: types.IRabbitMessage): Promise<void> {
    const target = new DtoPipe(LeaveFightDto);
    await this.leaveFightService.leaveFight(target.transform({ user: payload.user.userId } as LeaveFightDto));
  }
}
