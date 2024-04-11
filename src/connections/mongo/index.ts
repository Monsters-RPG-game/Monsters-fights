import mongoose from 'mongoose';
import getConfig from '../../tools/configLoader';
import Log from '../../tools/logger';
import type { ConnectOptions } from 'mongoose';

export default class Mongo {
  async init(): Promise<void> {
    process.env.NODE_ENV === 'test' ? await this.startMockServer() : await this.startServer();
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    await mongoose.connection.close();
  }

  private async startMockServer(): Promise<void> {
    const MockServer = await import('./mock');
    const mock = new MockServer.default();
    await mock.init();
  }

  private async startServer(): Promise<void> {
    await mongoose.connect(getConfig().mongoURI, {
      dbName: 'Messages',
    } as ConnectOptions);
    Log.log('Mongo', 'Started server');
  }
}
