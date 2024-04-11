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
import { ILeaveFightDto } from '../../../src/modules/fights/leave/types';

describe('Fights', () => {
  const db = new FakeFactory();
  const fakeFight = fakeData.fights[0] as IFightEntity;
  const create: ICreateFightDto = {
    attacker: fakeFight.attacker,
    teams: [[], [{ character: '65edaf46f08f4b4b8030ff38', hp: 10 }]],
  };
  const get: IGetFightDto = {
    owner: fakeFight.attacker,
    active: true,
    page: 1,
  };
  const leave: ILeaveFightDto = {
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

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Leave fight - missing user`, () => {
        const clone = structuredClone(leave);
        clone.user = undefined!;

        leaveController.leaveFight(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('user'));
        });
      });
    });

    describe('Incorrect data', () => {
      it(`Leave fight - user incorrect type`, async () => {
        const clone = structuredClone(leave);
        clone.user = 'asd';

        try {
          await leaveController.leaveFight(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('user should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it(`Leave`, async () => {
      await createController.createFight(create);
      await leaveController.leaveFight(leave);

      try {
        await getController.get(get);
      } catch (err) {
        expect(err).toEqual(new errors.UserNotInFight());
      }
    });
  });
});
