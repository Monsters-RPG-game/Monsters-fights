import type Broker from '../connections/broker';
import type Redis from '../connections/redis';

export interface IState {
  broker: Broker;
  redis: Redis;
}

export interface IConfigInterface {
  amqpURI: string;
  redisURI: string;
  mongoURI: string;
}
