import { afterEach, describe, expect, it } from '@jest/globals';
import State from '../../../src/modules/state';
import { IFullFight } from '../../../src/modules/fights/types';
import type { IFightCharacterEntity } from '../../../src/types/characters';
import fakeData from '../../utils/fakeData.json';
import { IFightEntity } from '../../../src/modules/fights/entity';
import { IStatsEntity } from '../../../src/modules/stats/entity';

describe('State', () => {
  const fakeFight = fakeData.fights[0] as IFightEntity;
  const fakeStats = fakeData.stats[0] as IStatsEntity;

  const fightCharacter: IFightCharacterEntity = {
    _id: fakeFight.attacker,
    lvl: fakeStats.lvl,
    stats: fakeStats.stats,
  };

  let state = new State();
  const fightId = '63e55edbe8a800060911121e';
  const leaveFightReq = {
    user: '63e55edbe8a800060911121e',
  };
  const createFightReq: IFullFight = {
    active: true,
    attacker: '63e55edbe8a800060911121e',
    log: '63e55edbe8a800060911121e',
    phase: 1,
    start: Date.now().toString(),
    finish: Date.now().toString(),
    states: {
      initialized: { attacker: [], enemy: [{ character: fightCharacter, stats: fakeStats._id }] },
      current: { attacker: [], enemy: [{ character: fightCharacter, stats: fakeStats._id }] },
      _id: fightId,
    },
    _id: fightId,
  };

  afterEach(() => {
    state = new State();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Get fight - no id`, () => {
        const data = state.get(undefined as unknown as string);
        expect(data).toBeUndefined();
      });

      it(`Leave fight - no id`, () => {
        try {
          state.leave(undefined as unknown as string);
        } catch (err) {
          expect(err).toBeUndefined();
        }
      });
    });

    describe('Incorrect data', () => {
      it(`Leave fight - no fight`, () => {
        try {
          state.leave(leaveFightReq.user);
        } catch (err) {
          expect(err).toBeUndefined();
        }
      });

      it(`Get fight - no fight`, () => {
        const data = state.get(fightId);
        expect(data).toBeUndefined();
      });
    });
  });

  describe('Should pass', () => {
    it(`Create fight`, () => {
      try {
        state.create(createFightReq);
        const fight = state.get(fightId);
        expect(fight?.log).toEqual(createFightReq.log);
        expect(fight?.attacker).toEqual(createFightReq.attacker);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });

    it(`Leave fight`, () => {
      try {
        state.create(createFightReq);
        state.leave(leaveFightReq.user);
        const fight = state.get(fightId);
        expect(fight).toBeUndefined();
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });

    it(`Get fight`, () => {
      try {
        state.create(createFightReq);
        const fight = state.get(fightId);
        expect(fight?.log).toEqual(createFightReq.log);
        expect(fight?.attacker).toEqual(createFightReq.attacker);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
