import Broker from './connections/broker';
import Mongo from './connections/mongo';
import Redis from './connections/redis';
import Liveness from './tools/liveness';
import Log from './tools/logger';
import State from './tools/state';
import type { IFullError } from './types';

class App {
  private _liveness: Liveness | undefined;

  private get liveness(): Liveness | undefined {
    return this._liveness;
  }

  private set liveness(value: Liveness | undefined) {
    this._liveness = value;
  }

  init(): void {
    this.start().catch((err) => {
      const { stack, message } = err as IFullError;
      Log.log('Server', 'Err while initializing app');
      Log.log('Server', message, stack);

      return this.kill();
    });
  }

  kill(): void {
    State.broker.close();
    State.redis.close().catch((err) => {
      Log.error('Redis', 'Could not kill redis', (err as Error).message, (err as Error).stack);
    });

    Log.log('Server', 'Server closed');
  }

  private async start(): Promise<void> {
    const mongo = new Mongo();
    State.broker = new Broker();
    State.redis = new Redis();

    State.broker.init();
    await mongo.init();
    await State.redis.init();
    Log.log('Server', 'Server started');

    this.liveness = new Liveness();
    this.liveness.init();
  }
}

const app = new App();
app.init();
