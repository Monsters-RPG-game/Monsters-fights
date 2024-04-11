import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import AttackController from '../../../src/modules/fights/attack';
import CreateController from '../../../src/modules/fights/create';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import { IStateEntity } from '../../../src/modules/state/entity';
import { IFightEntity } from '../../../src/modules/fights/entity';
import { IAttackDto } from '../../../src/modules/fights/attack/types';
import { ICreateFightDto } from '../../../src/modules/fights/create/types';

describe('Fights', () => {
  const db = new FakeFactory();
  const fakeFight = fakeData.fights[0] as IFightEntity;
  const fakeState = fakeData.states[0] as IStateEntity;
  const attack: IAttackDto = { target: fakeState.current.teams[1]![0]!.character };
  const create: ICreateFightDto = {
    attacker: fakeFight.attacker,
    teams: [[], [{ character: '65edaf46f08f4b4b8030ff38', hp: 10 }]],
  };

  let attackController = new AttackController();
  let createController = new CreateController();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();

    attackController = new AttackController();
    createController = new CreateController();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Attack - missing target`, () => {
        const clone = structuredClone(attack);
        clone.target = undefined!;

        attackController.attack(clone, fakeFight.attacker).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('target'));
        });
      });
    });

    describe('Incorrect data', () => {
      it(`Attack - target incorrect type`, async () => {
        const clone = structuredClone(attack);
        clone.target = 'asd';

        try {
          await attackController.attack(clone, fakeFight.attacker);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('target should be objectId'));
        }
      });

      it(`Attack - not in fight`, async () => {
        try {
          await attackController.attack(attack, fakeFight.attacker);
        } catch (err) {
          expect(err).toEqual(new errors.UserNotInFight());
        }
      });
    });
  });

  describe('Should pass', () => {
    it(`Attack`, async () => {
      await createController.createFight(create);

      try {
        await attackController.attack(attack, fakeFight.attacker);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
