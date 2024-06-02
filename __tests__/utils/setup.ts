import { beforeAll } from '@jest/globals';
import FakeRedis from './mocks/fakeRedis';
import State from '../../src/tools/state';

beforeAll(() => {
  State.redis = new FakeRedis();
});
