import { Injectable } from '@nestjs/common';
import AttackDto from './modules/fight/attack/attack.dto';
import AttackService from './modules/fight/attack/attack.service';
import CreateFightDto from './modules/fight/createFight/createFight.dto';
import CreateFightService from './modules/fight/createFight/createFight.service';
import GetFightDto from './modules/fight/get/get.dto';
import GetFightService from './modules/fight/get/get.service';
import GetLogsDto from './modules/fight/getLogs/getLogs.dto';
import GetLogsService from './modules/fight/getLogs/getLogs.service';
import LeaveFightDto from './modules/fight/leaveFight/leaveFight.dto';
import LeaveFightService from './modules/fight/leaveFight/leaveFight.service';
import DtoPipe from './tools/pipes/dto.pipe';
import type { EFightStatus } from './enums';
import type { IActionEntity } from './modules/action/action.entity';
import type { IFightReport, IFullFightLogs } from './modules/fight/fight.types';
import type * as types from './types';

@Injectable()
export default class AppService {
  constructor(
    private readonly attackService: AttackService,
    private readonly createFightService: CreateFightService,
    private readonly leaveFightService: LeaveFightService,
    private readonly getLogsService: GetLogsService,
    private readonly getFightsService: GetFightService,
  ) {
    //
  }

  async attack(payload: types.IRabbitMessage): Promise<{ logs: Omit<IActionEntity, '_id'>[]; status: EFightStatus }> {
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

  async getLogs(payload: types.IRabbitMessage): Promise<IFullFightLogs | null> {
    const target = new DtoPipe(GetLogsDto);
    return this.getLogsService.get(target.transform(payload.payload as GetLogsDto));
  }

  async getFights(payload: types.IRabbitMessage): Promise<IFightReport[]> {
    const target = new DtoPipe(GetFightDto);
    return this.getFightsService.get(target.transform(payload.payload as GetFightDto));
  }
}
