import { Controller } from '@nestjs/common';
import Log from '../../../tools/logger/log';
import type { IRabbitMessage } from '../../../types';

@Controller()
export default class AttackController {
  async attack(payload: IRabbitMessage): Promise<void> {
    Log.log('Got new attack message:', payload);

    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
