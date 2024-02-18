import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import AppService from './app.service';
import BrokerService from './connections/broker/broker.service';
import * as enums from './enums';
import { EMessageTypes } from './enums';
import * as errors from './errors';
import Log from './tools/logger/log';
import { IRabbitMessage } from './types';
import type { IFullError } from './types';

@Controller()
export default class AppController {
  private _queue: Record<string, IRabbitMessage> = {};

  constructor(
    private readonly service: AppService,
    private readonly client: BrokerService,
  ) {
    //
  }

  @MessagePattern()
  async handleMessage(payload: IRabbitMessage): Promise<void> {
    Log.log('Server', 'Got new message');
    Log.log('Server', JSON.stringify(payload));

    if (payload.target === enums.EMessageTypes.Heartbeat) {
      await this.client.sendHeartBeat();
    } else {
      this._queue[payload.user.tempId] = payload;
      this.errorWrapper(async () => this.routeMessage(payload), payload.user.tempId);
    }
  }

  async routeMessage(payload: IRabbitMessage): Promise<void> {
    const data: { messageType: EMessageTypes; payload: unknown } = {
      payload: undefined,
      messageType: EMessageTypes.Send,
    };

    switch (payload.target) {
      case enums.EMessageTargets.Fight:
        data.payload = await this.routeFightMessage(payload);
        break;
      default:
        throw new errors.IncorrectTargetError();
    }

    const userId = payload.user.userId as string;
    const prevData = this._queue[userId];
    delete this._queue[userId];
    await this.client.send(prevData as IRabbitMessage, data, data.messageType);
  }

  async routeFightMessage(payload: IRabbitMessage): Promise<unknown> {
    switch (payload.subTarget) {
      case enums.EFightsTargets.Attack:
        return this.service.attack(payload);
      default:
        throw new errors.IncorrectTargetError();
    }
  }

  private errorWrapper(func: () => Promise<void>, user: string): void {
    func().catch(async (err) => {
      const { message, name, code, status, stack } = err as IFullError;
      Log.error('Modules', 'Generic err', message, stack);

      const prevData = this._queue[user];
      delete this._queue[user];

      if (!status) {
        await this.client.send(
          prevData as IRabbitMessage,
          {
            message,
            name,
            code,
            status: 500,
          },
          enums.EMessageTypes.Error,
        );
      } else {
        await this.client.send(
          prevData as IRabbitMessage,
          {
            message,
            name,
            code,
            status,
          },
          enums.EMessageTypes.Error,
        );
      }
    });
  }
}
