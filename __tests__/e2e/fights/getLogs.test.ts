import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as errors from '../../../src/errors';
import AttackController from '../../../src/modules/fights/attack';
import CreateController from '../../../src/modules/fights/create';
import GetController from '../../../src/modules/fights/get';
import GetLogsController from '../../../src/modules/fights/getLogs';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import type { IAttackDto } from '../../../src/modules/fights/attack/types';
import type { ICreateFightDto } from '../../../src/modules/fights/create/types';
import type { IFightEntity } from '../../../src/modules/fights/entity';
import type { IGetFightDto } from '../../../src/modules/fights/get/types';
import type { IGetLogsDto } from '../../../src/modules/fights/getLogs/types';
import type { ISkillsEntity } from '../../../src/modules/skills/entity';
import type { IStateEntity } from '../../../src/modules/state/entity';
import type { IStatsEntity } from '../../../src/modules/stats/entity';
import type { IFightCharacterEntity } from '../../../src/types/characters';

describe('Fights', () => {
  const db = new FakeFactory();
  const fakeFight = fakeData.fights[0] as IFightEntity;
  const fakeState = fakeData.states[0] as IStateEntity;
  const fakeStats = fakeData.stats[0] as IStatsEntity;
  const fakeSkills = fakeData.skills[0] as ISkillsEntity;
  const attack: IAttackDto = { target: fakeState.current.attacker[0]!.character };
  const fightCharacter: IFightCharacterEntity = {
    _id: fakeFight.attacker,
    lvl: fakeStats.lvl,
    stats: fakeStats.stats,
  };
  const create: ICreateFightDto = {
    attacker: fightCharacter,
    teams: [[], [{ character: fightCharacter, stats: fakeStats._id }]],
    skills: fakeSkills,
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
  let attackController = new AttackController();
  let createController = new CreateController();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();

    getController = new GetController();
    getLogsController = new GetLogsController();
    attackController = new AttackController();
    createController = new CreateController();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Get fight logs - missing id', () => {
        const clone = structuredClone(getLogs);
        clone.id = undefined!;

        getLogsController.get(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('id'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Get fight logs - id incorrect type', async () => {
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
    it('Get logs', async () => {
      await createController.createFight(create);
      await attackController.attack(attack, fakeFight.attacker);
      const fight = await getController.get(get);
      const logs = await getLogsController.get({ id: fight[0]!.log._id });

      expect(logs?.logs.length).toEqual(1);
    });
  });
});
