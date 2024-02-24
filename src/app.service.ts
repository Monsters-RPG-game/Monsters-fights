import { Injectable } from '@nestjs/common';
import AttackService from './modules/fight/attack/attack.service';
import Log from './tools/logger/log';
import type * as types from './types';

@Injectable()
export default class AppService {
  constructor(private readonly attackService: AttackService) {
    //
  }

  async attack(payload: types.IRabbitMessage): Promise<void> {
    await this.attackService.attack(payload);
    Log.log('Got new attack message:', payload);

    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
