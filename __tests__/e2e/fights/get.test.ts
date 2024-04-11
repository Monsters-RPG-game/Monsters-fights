import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import GetController from '../../../src/modules/fights/get';
import GetLogsController from '../../../src/modules/fights/getLogs';
import CreateController from '../../../src/modules/fights/create';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import { IFightEntity } from '../../../src/modules/fights/entity';
import { ICreateFightDto } from '../../../src/modules/fights/create/types';
import { IGetFightDto } from '../../../src/modules/fights/get/types';
import { IGetLogsDto } from '../../../src/modules/fights/getLogs/types';

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
  const getLogs: IGetLogsDto = {
    id: fakeFight._id,
  };

  let getController = new GetController();
  let getLogsController = new GetLogsController();
  let createController = new CreateController();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();

    getController = new GetController();
    getLogsController = new GetLogsController();
    createController = new CreateController();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Get fight - missing owner`, () => {
        const clone = structuredClone(get);
        clone.owner = undefined!;

        getController.get(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('owner'));
        });
      });

      it(`Get fight - missing active`, () => {
        const clone = structuredClone(get);
        clone.active = undefined!;

        getController.get(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('active'));
        });
      });
    });

    describe('Incorrect data', () => {
      it(`Get fight - owner incorrect type`, async () => {
        const clone = structuredClone(get);
        clone.owner = 'asd';

        try {
          await getController.get(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('owner should be objectId'));
        }
      });

      it(`Get fight - owner incorrect type`, async () => {
        const clone = structuredClone(get);
        clone.active = 'asd' as unknown as boolean;

        try {
          await getController.get(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('active should be boolean'));
        }
      });

      it(`Get fight logs - id incorrect type`, async () => {
        const clone = structuredClone(getLogs);
        clone.id = 'asd';

        try {
          await getLogsController.get(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('id should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it(`Get`, async () => {
      await createController.createFight(create);
      const fight = await getController.get(get);

      expect(fight.length).toEqual(1);
      expect(fight[0]!.active).toEqual(true);
    });
  });
});
