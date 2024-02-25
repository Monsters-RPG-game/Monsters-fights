import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import * as enums from '../../enums';
import { NotConnectedError } from '../../errors';
import Log from '../../tools/logger/log';
import type { IRabbitMessage } from '../../types';

@Injectable()
export default class BrokerService {
  constructor(private readonly client: AmqpConnection) {
    //
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onModuleInit(): void {
    this.sendHeartBeat().catch((err) => {
      Log.error('Could not send heartBeat', err);
    });
  }

  async send(userData: IRabbitMessage, payload: unknown, target: enums.EMessageTypes): Promise<void> {
    const body = { ...userData, payload, target };
    if (!this.client.connected) throw new NotConnectedError();
    await this.client.publish(enums.EAmqQueues.Gateway, '', Buffer.from(JSON.stringify(body)));
  }

  async sendHeartBeat(): Promise<void> {
    await this.sendMessage({
      payload: enums.EServices.Fights,
      target: enums.EMessageTypes.Heartbeat,
    });
  }

  private async sendMessage(message: unknown): Promise<void> {
    await this.client.publish('gatewayQueue', '', Buffer.from(JSON.stringify(message)));
  }
}
