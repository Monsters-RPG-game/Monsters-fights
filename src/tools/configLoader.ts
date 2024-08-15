import Log from './logger';
import devConfig from '../../config/devConfig.json';
import exampleConfig from '../../config/exampleConfig.json';
import prodConfig from '../../config/prodConfig.json';
import testDevConfig from '../../config/testConfig.json';
import type * as types from '../types';

/**
 * Load config from json files.
 */
export default function getConfig(): types.IConfigInterface {
  switch (process.env.NODE_ENV) {
    case 'testDev':
      if (testDevConfig.amqpURI) return testDevConfig;
      Log.error('Config', 'Config file is incomplete. Using example config');
      return exampleConfig;
    case 'dev':
    case 'test':
      if (devConfig.amqpURI) return devConfig;
      Log.error('Config', 'Config file is incomplete. Using example config');
      return exampleConfig;
    case 'production':
      if (prodConfig.amqpURI) return prodConfig;
      Log.error('Config', 'Config file is incomplete. Using example config');
      return exampleConfig;
    default:
      throw new Error('No config files');
  }
}
