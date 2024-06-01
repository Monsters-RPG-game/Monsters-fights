import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import GetController from '../../../src/modules/fights/get';
import CreateController from '../../../src/modules/fights/create';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import { IFightEntity } from '../../../src/modules/fights/entity';
import { ICreateFightDto } from '../../../src/modules/fights/create/types';
import { IGetFightDto } from '../../../src/modules/fights/get/types';
import { IStateTeam } from '../../../src/modules/state/types';
import { IStatsEntity } from '../../../src/modules/stats/entity';
import type { IFightCharacterEntity } from '../../../src/types/characters';

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
    teams: [[], [{ character: fightCharacter, stats: fakeStats._id }]],
  };
  const get: IGetFightDto = {
    owner: fakeFight.attacker,
    active: true,
    page: 1,
  };

  let getController = new GetController();
  let createController = new CreateController();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();

    getController = new GetController();
    createController = new CreateController();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Create fight - missing attack`, () => {
        const clone = structuredClone(create);
        clone.attacker = undefined!;

        createController.createFight(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('attacker'));
        });
      });

      it(`Create fight - missing teams`, () => {
        const clone = structuredClone(create);
        clone.teams = undefined!;

        createController.createFight(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('teams'));
        });
      });

      it(`Create fight - one of teams is missing character`, () => {
        const clone = structuredClone(create);
        clone.teams = [[], [{ hp: 10 }]] as unknown as [IStateTeam[], IStateTeam[]];

        createController.createFight(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('character'));
        });
      });
    });

    describe('Incorrect data', () => {
      it(`Create fight - attacker incorrect type`, async () => {
        const clone = structuredClone(create);
        clone.attacker = 'asd' as unknown as IFightCharacterEntity;

        try {
          await createController.createFight(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('character'));
        }
      });

      it(`Create fight - teams incorrect type`, async () => {
        const clone = structuredClone(create);
        clone.teams = 'asd' as unknown as [IStateTeam[], IStateTeam[]];

        try {
          await createController.createFight(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('teams should be array'));
        }
      });

      it(`Create fight - no targets provided in enemy team`, async () => {
        const clone = structuredClone(create);
        clone.teams = [[], []];

        try {
          await createController.createFight(clone);
        } catch (err) {
          expect(err).toEqual(new errors.ElementTooShortError('enemy team', 1));
        }
      });

      it(`Create fight - user already in fight`, async () => {
        await db.fight
          .log(fakeFight.log)
          .fightStates(fakeFight.states)
          .attacker(fakeFight.attacker)
          .phase(fakeFight.phase)
          .finish(fakeFight.finish)
          .start(fakeFight.start)
          .active(fakeFight.active)
          .create();

        try {
          await createController.createFight(create);
        } catch (err) {
          expect(err).toEqual(new errors.UserAlreadyInFight());
        }
      });
    });
  });

  describe('Should pass', () => {
    it(`Create fight`, async () => {
      await createController.createFight(create);
      const fight = await getController.get(get);

      expect(fight.length).toEqual(1);
      expect(fight[0]!.active).toEqual(true);
    });
  });
});
