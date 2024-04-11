import { afterEach, describe, expect, it } from '@jest/globals';
import State from '../../../src/modules/state';
import { ILeaveFightDto } from '../../../src/modules/fights/leave/types';
import { IFullFight } from '../../../src/modules/fights/types';

describe('State', () => {
  let state = new State();
  const fightId = '63e55edbe8a800060911121e';
  const leaveFightReq: ILeaveFightDto = {
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
      initialized: { teams: [[], [{ character: '63e55edbe8a800060911121d', hp: 10 }]] },
      current: { teams: [[], [{ character: '63e55edbe8a800060911121d', hp: 10 }]] },
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
          state.leave(undefined as unknown as ILeaveFightDto);
        } catch (err) {
          expect(err).toBeUndefined();
        }
      });
    });

    describe('Incorrect data', () => {
      it(`Leave fight - no fight`, () => {
        try {
          state.leave(leaveFightReq);
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
        state.leave(leaveFightReq);
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
