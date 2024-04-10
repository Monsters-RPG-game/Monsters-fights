import type Broker from '../connections/broker';

export interface IState {
  broker: Broker;
}

export interface IConfigInterface {
  amqpURI: string;
  mongoURI: string;
}
