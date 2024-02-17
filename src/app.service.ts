import { Injectable } from '@nestjs/common';
import Log from './tools/logger/log';
import type * as types from './types';

@Injectable()
export default class AppService {
  async attack(payload: types.IRabbitMessage): Promise<void> {
    Log.log('Got new attack message:', payload);
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
