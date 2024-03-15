import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import ActionsRooster from '../action/action.rooster';
import LogRooster from '../log/log.rooster';
import type { IFullFightLogs } from './fight.types';
import type { ILogEntity } from '../log/log.entity';

@Injectable()
export default class FightsUtils {
  constructor(
    private readonly actionsRooster: ActionsRooster,
    private readonly logRooster: LogRooster,
  ) {
    //
  }

  async prepareLogs(id: string): Promise<IFullFightLogs> {
    const preparedLogs: IFullFightLogs = {
      logs: [],
      _id: new mongoose.Types.ObjectId(id),
    };

    const logs = (await this.logRooster.get(id)) as ILogEntity;

    if (logs.logs.length > 0) {
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
