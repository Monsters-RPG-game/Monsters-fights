import devConfig from '../../config/devConfig.json';
import prodConfig from '../../config/prodConfig.json';
import testDevConfig from '../../config/testConfig.json';
import type * as types from '../types';

/**
 * Load config from json files
 */
export default function getConfig(): types.IConfigInterface {
  switch (process.env.NODE_ENV) {
    case 'testDev':
      return testDevConfig as types.IConfigInterface;
    case 'dev':
    case 'test':
      return devConfig as types.IConfigInterface;
    case 'production':
      return prodConfig as types.IConfigInterface;
    default:
      throw new Error('No config files');
  }
}
