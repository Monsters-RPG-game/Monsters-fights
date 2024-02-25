import { Injectable } from '@nestjs/common';
import AttackService from './modules/fight/attack/attack.service';
import CreateFightDto from './modules/fight/createFight/createFight.dto';
import CreateFightService from './modules/fight/createFight/createFight.service';
import DtoPipe from './tools/pipes/dto.pipe';
import type * as types from './types';

@Injectable()
export default class AppService {
  constructor(
    private readonly attackService: AttackService,
    private readonly createFightService: CreateFightService,
  ) {
    //
  }

  async attack(payload: types.IRabbitMessage): Promise<void> {
    await this.attackService.attack(payload);
  }

  async createFight(payload: types.IRabbitMessage): Promise<void> {
    const target = new DtoPipe(CreateFightDto);
    await this.createFightService.createFight(target.transform(payload.payload as CreateFightDto));
  }
}
