import type Broker from '../connections/broker';
import type StateController from '../modules/state';

export interface IState {
  broker: Broker;
  cache: StateController;
}

export interface IConfigInterface {
  amqpURI: string;
  mongoURI: string;
}
