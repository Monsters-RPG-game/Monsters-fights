import { beforeAll } from '@jest/globals';
import State from '../../src/tools/state';
import StateController from '../../src/modules/state';

beforeAll(() => {
  State.cache = new StateController();
});
