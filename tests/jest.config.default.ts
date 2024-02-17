import { defaults } from 'jest-config';
import type { Config } from 'jest';
// eslint-disable-next-line import/no-extraneous-dependencies

const config: Config = {
  verbose: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  testPathIgnorePatterns: ['build'],
  preset: 'ts-jest',
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  forceExit: true,
  clearMocks: true,
};

export default config;
