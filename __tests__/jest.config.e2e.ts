import defaultConfig from './jest.config.default';
import type { Config } from 'jest';

const config: Config = {
  ...defaultConfig,
  roots: ['./e2e'],
  setupFilesAfterEnv: ['./utils/setup.ts'],
};

export default config;
