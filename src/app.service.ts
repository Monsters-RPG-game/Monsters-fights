import { Injectable } from '@nestjs/common';
import BrokerService from './broker/broker.service';
import * as console from 'node:console';

@Injectable()
export default class AppService {
  constructor(private readonly client: BrokerService) {
    //
  }

  async handleMessage(data: unknown): Promise<void> {
    console.log('Received message:', data);
    await this.client.sendHeartBeat();
  }
}
