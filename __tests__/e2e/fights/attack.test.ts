import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as errors from '../../../src/errors';
import AttackController from '../../../src/modules/fights/attack';
import CreateController from '../../../src/modules/fights/create';
import StateController from '../../../src/modules/state/controller';
import StatsController from '../../../src/modules/stats/controller';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import type { IAttackDto } from '../../../src/modules/fights/attack/types';
import type { ICreateFightDto } from '../../../src/modules/fights/create/types';
import type { ISkillsEntity } from '../../../src/modules/skills/entity';
import type { IStatsEntity } from '../../../src/modules/stats/entity';
import type { IFightCharacterEntity } from '../../../src/types/characters';

describe('Fights', () => {
  const db = new FakeFactory();
  const fakeStats = fakeData.stats[0] as IStatsEntity;
  const fakeStats2 = fakeData.stats[1] as IStatsEntity;
  const fakeStats3 = fakeData.stats[2] as IStatsEntity;
  const fakeSkills = fakeData.skills[0] as ISkillsEntity;
  const testEnemy: IFightCharacterEntity = {
    _id: '65ed8d7746df2cc0f50926ab',
    lvl: 1,
    stats: fakeStats.stats,
  };
  const testEnemy2: IFightCharacterEntity = {
    _id: '65edaf46f08f4b4b8030ff39',
    lvl: 3,
    stats: fakeStats3.stats,
  };
  const testPlayer: IFightCharacterEntity = {
    _id: '65edaf46f08f4b4b8030ff38',
    lvl: 2,
    stats: fakeStats2.stats,
  };
  const testAttack: IAttackDto = { target: testEnemy._id };

  const testCreate: ICreateFightDto = {
    attacker: testPlayer,
    teams: [
      [],
      [
        {
          character: testEnemy,
          stats: fakeStats._id,
        },
        {
          character: testEnemy2,
          stats: fakeStats3._id,
        },
      ],
    ],
    skills: fakeSkills,
  };

  let attackController = new AttackController();
  let createController = new CreateController();
  let stateController = new StateController();
  let statsController = new StatsController();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();

    attackController = new AttackController();
    createController = new CreateController();
    stateController = new StateController();
    statsController = new StatsController();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Attack - missing target', () => {
        const clone = structuredClone(testAttack);
        clone.target = undefined!;

        attackController.attack(clone, testEnemy._id).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('target'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Attack - target incorrect type', async () => {
        const clone = structuredClone(testAttack);
        clone.target = 'asd';

        try {
          await attackController.attack(clone, testEnemy._id);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('target should be objectId'));
        }
      });

      it('Attack - not in fight', async () => {
        try {
          await attackController.attack(testAttack, testPlayer._id);
        } catch (err) {
          expect(err).toEqual(new errors.UserNotInFight());
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Attack - hp of attacker is 5', async () => {
      await createController.createFight(testCreate);
      try {
        await attackController.attack(testAttack, testPlayer._id);
        const state = await stateController.rooster.getAll(1);
        const stats = await statsController.rooster.get(state[0]?.current.enemy[0]?.stats);
        expect(stats?.stats.hp).toBe(7);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
