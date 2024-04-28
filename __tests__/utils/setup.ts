import { beforeAll } from '@jest/globals';
import State from '../../src/tools/state';
import FakeRedis from './mocks/fakeRedis';

beforeAll(() => {
  State.redis = new FakeRedis();
});
