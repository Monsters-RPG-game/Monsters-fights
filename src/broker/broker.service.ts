import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import * as enums from '../enums';

@Injectable()
export default class BrokerService {
  constructor(private readonly client: AmqpConnection) {
    //
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
