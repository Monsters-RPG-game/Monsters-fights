import type * as types from '../types';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Load config from json files
 */
export default function getConfig(): types.IConfigInterface {
  let target: string = '';

  switch (process.env.NODE_ENV) {
    case 'testDev':
      target = 'testConfig.json';
      break;
    case 'dev':
    case 'test':
      target = 'devConfig.json';
      break;
    case 'production':
      target = 'prodConfig.json';
      break;
    default:
      throw new Error('No config files');
  }

  return JSON.parse(fs.readFileSync(path.join('config', target)).toString()) as types.IConfigInterface;
}
