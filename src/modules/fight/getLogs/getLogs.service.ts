import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import GetLogsDto from './getLogs.dto';
import DtoPipe from '../../../tools/pipes/dto.pipe';
import FightsUtils from '../fights.utils';
import type { IFullFightLogs } from '../fight.types';

@Injectable()
export default class GetFightService {
  constructor(private readonly fightUtils: FightsUtils) {
    //
  }

  async get(@Payload(new DtoPipe(GetLogsDto)) payload: GetLogsDto): Promise<IFullFightLogs | null> {
    return this.fightUtils.prepareLogs(payload.id);
  }
}
