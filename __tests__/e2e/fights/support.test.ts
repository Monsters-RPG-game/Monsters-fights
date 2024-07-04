import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import AttackController from '../../../src/modules/fights/attack';
import CreateController from '../../../src/modules/fights/create';
import UseSkillController from '../../../src/modules/fights/useSkill';
import StateController from '../../../src/modules/state/controller';
import StatsController from '../../../src/modules/stats/controller';
import State from '../../../src/tools/state';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import type { IAttackDto } from '../../../src/modules/fights/attack/types';
import type { ICreateFightDto } from '../../../src/modules/fights/create/types';
import type { IUseSkillDto } from '../../../src/modules/fights/useSkill/types';
import type { ISkillsEntity } from '../../../src/modules/skills/entity';
import type { IStatsEntity } from '../../../src/modules/stats/entity';
import type { IFullError } from '../../../src/types';
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
  const testSuport: IUseSkillDto = { target: testPlayer._id, skillId: fakeSkills.singleSkills[1]!._id };
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
  let useSkillController = new UseSkillController();
  let createController = new CreateController();
  let stateController = new StateController();
  let statsController = new StatsController();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
    await State.redis.addCachedSkills(fakeSkills, testPlayer._id);
  });

  afterEach(async () => {
    await db.cleanUp();
    attackController = new AttackController();
    useSkillController = new UseSkillController();
    createController = new CreateController();
    stateController = new StateController();
    statsController = new StatsController();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should pass', () => {
    it('Attack - hp of attacker is 96 after 2 rounds', async () => {
      /**
       * In first round we deal damage and get damaged from 2 enemies
       * In second round we use healing skill but enemies still attacks us with 2 attacks
       * First enemy deals 2 dmg, second enemy deals 5 dmg
       * Healing skill adds 100 hp
       */
      await createController.createFight(testCreate);
      let error: IFullError | undefined = undefined;
      try {
        await attackController.attack(testAttack, testPlayer._id);
        await useSkillController.useSkill(testSuport, testPlayer._id);
        const state = await stateController.rooster.getAll(1);
        const stats = await statsController.rooster.get(state[0]?.current.attacker[0]?.stats);

        expect(stats?.stats.hp).toBe(96);
      } catch (err) {
        error = err as IFullError;
      }
      expect(error).toBeUndefined();
    });
  });
});
