import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import GetController from '../../../src/modules/fights/get';
import CreateController from '../../../src/modules/fights/create';
import LeaveController from '../../../src/modules/fights/leave';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import { IFightEntity } from '../../../src/modules/fights/entity';
import { ICreateFightDto } from '../../../src/modules/fights/create/types';
import { IGetFightDto } from '../../../src/modules/fights/get/types';
import type { IFightCharacterEntity } from '../../../src/types/characters';
import { IStatsEntity } from '../../../src/modules/stats/entity';

describe('Fights', () => {
  const db = new FakeFactory();
  const fakeFight = fakeData.fights[0] as IFightEntity;
  const fakeStats = fakeData.stats[0] as IStatsEntity;
  const fightCharacter: IFightCharacterEntity = {
    _id: fakeFight.attacker,
    lvl: fakeStats.lvl,
    stats: fakeStats.stats,
  };
  const create: ICreateFightDto = {
    attacker: fightCharacter,
    teams: [[], [{
      character: fightCharacter,
      stats: fakeStats._id,
    }]],
  };
  const get: IGetFightDto = {
    owner: fakeFight.attacker,
    active: true,
    page: 1,
  };
  const leave = {
    user: fakeFight.attacker,
  };

  let getController = new GetController();
  let leaveController = new LeaveController();
  let createController = new CreateController();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();

    getController = new GetController();
    leaveController = new LeaveController();
    createController = new CreateController();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should pass', () => {
    it(`Leave`, async () => {
      await createController.createFight(create);
      await leaveController.leaveFight(leave.user);

      try {
        await getController.get(get);
      } catch (err) {
        expect(err).toEqual(new errors.UserNotInFight());
      }
    });
  });
});
