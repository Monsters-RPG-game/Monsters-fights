import { defaults } from 'jest-config';
import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  testPathIgnorePatterns: ['build'],
  preset: 'ts-jest',
  testMatch: ['**/*.test.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(mongodb-memory-server/index.d.ts))'],
  testEnvironment: 'node',
  forceExit: true,
  clearMocks: true,
  passWithNoTests: true,
};

export default config;
