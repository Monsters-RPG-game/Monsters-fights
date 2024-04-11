import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import { ILeaveFightDto } from '../../../src/modules/fights/leave/types';
import LeaveFightDto from '../../../src/modules/fights/leave/dto';

describe('Fights - leave', () => {
  const data: ILeaveFightDto = {
    user: '63e55edbe8a800060911121e',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing user`, () => {
        const clone = structuredClone(data);
        clone.user = undefined!;

        try {
          new LeaveFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('user'));
        }
      });
    });

    describe('Incorrect data', () => {
      it(`Id incorrect type`, () => {
        const clone = structuredClone(data);
        clone.user = 'bc';

        try {
          new LeaveFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('user should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it(`Get logs`, () => {
      const clone = structuredClone(data);

      try {
        new LeaveFightDto(clone);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
