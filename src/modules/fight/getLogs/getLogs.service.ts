import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import mongoose from 'mongoose';
import GetLogsDto from './getLogs.dto';
import DtoPipe from '../../../tools/pipes/dto.pipe';
import ActionsRooster from '../../action/action.rooster';
import LogRooster from '../../log/log.rooster';
import type { IFullFightLogs } from '../fight.types';

@Injectable()
export default class GetFightService {
  constructor(
    private readonly logRooster: LogRooster,
    private readonly actionsRooster: ActionsRooster,
  ) {
    //
  }

  async get(@Payload(new DtoPipe(GetLogsDto)) payload: GetLogsDto): Promise<IFullFightLogs | null> {
    const preparedLogs: IFullFightLogs = {
      logs: [],
      _id: new mongoose.Types.ObjectId(payload.id),
    };
    const logs = await this.logRooster.get(payload.id);
    if (!logs) return logs;

    if (logs?.logs.length > 0) {
      preparedLogs.logs = await Promise.all(
        logs.logs.map(async (l) => {
          return {
            phase: l.phase,
            actions: await this.actionsRooster.getMany(l.actions),
          };
        }),
      );
    }

    return preparedLogs;
  }
}
