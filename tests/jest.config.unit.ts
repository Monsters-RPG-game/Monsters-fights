import defaultConfig from './jest.config.default';
import type { Config } from 'jest';

const config: Config = {
  ...defaultConfig,
  roots: ['./unit'],
};

export default config;
