import { Config } from 'jest';
import defaultConfig from './jest.config.default';

const config: Config = {
  ...defaultConfig,
  roots: ['./e2e'],
  setupFilesAfterEnv: ['./utils/setup.ts'],
};

export default config;
