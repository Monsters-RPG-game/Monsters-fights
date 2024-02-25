import { Injectable } from '@nestjs/common';
import Log from '../../../tools/logger';
import type * as types from '../../../types';

@Injectable()
export default class AttackService {
  async attack(payload: types.IRabbitMessage): Promise<void> {
    Log.log('Got new attack message in attack module:', payload);
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
