import BrokerService from '../../../src/connections/broker/broker.service';
import * as enums from '../../../src/enums';
import { EFightsTargets, EUserTypes } from '../../../src/enums';
import type { IRabbitMessage } from '../../../src/types';
import type { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

class FakeBrokerService extends BrokerService {
  private _messages: IRabbitMessage[] = [];

  constructor() {
    super({} as unknown as AmqpConnection);
  }

  private get messages(): IRabbitMessage[] {
    return this._messages;
  }

  getLastMessage(): IRabbitMessage | undefined {
    return this.messages[this.messages.length === 0 ? 0 : this.messages.length - 1];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  override onModuleInit(): void {
    //
  }

  override async send(userData: IRabbitMessage, payload: unknown, target: enums.EMessageTypes): Promise<void> {
    return new Promise((resolve) => {
      const message: IRabbitMessage = { ...userData, payload, target };
      this.messages.push(message);
      resolve(undefined);
    });
  }

  override async sendHeartBeat(): Promise<void> {
    return new Promise((resolve) => {
      this.messages.push({
        payload: {},
        subTarget: EFightsTargets.Attack,
        user: { userId: '', tempId: '', type: EUserTypes.User, validated: false },
        target: enums.EMessageTypes.Heartbeat,
      });
      resolve(undefined);
    });
  }
}

export default new FakeBrokerService();
