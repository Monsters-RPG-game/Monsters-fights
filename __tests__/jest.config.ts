import defaultConfig from './jest.config.default';
import type { Config } from 'jest';

const config: Config = {
  ...defaultConfig,
  roots: ['./'],
};

export default config;
