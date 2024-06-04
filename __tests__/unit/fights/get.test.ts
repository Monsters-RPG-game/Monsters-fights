import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import GetFightDto from '../../../src/modules/fights/get/dto';
import type { IGetFightDto } from '../../../src/modules/fights/get/types';

describe('Fights - get', () => {
  const data: IGetFightDto = {
    owner: '63e55edbe8a800060911121e',
    active: true,
    page: 1,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing owner', () => {
        const clone = structuredClone(data);
        clone.owner = undefined!;

        try {
          new GetFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('owner'));
        }
      });

      it('Missing active', () => {
        const clone = structuredClone(data);
        clone.active = undefined!;

        try {
          new GetFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('active'));
        }
      });
    });

    describe('Incorrect data', () => {
      it('Owner incorrect type', () => {
        const clone = structuredClone(data);
        clone.owner = 'bc';

        try {
          new GetFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('owner should be objectId'));
        }
      });

      it('Active incorrect type', () => {
        const clone = structuredClone(data);
        clone.active = 'bc' as unknown as boolean;

        try {
          new GetFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('active should be boolean'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Get active', () => {
      const clone = structuredClone(data);

      try {
        new GetFightDto(clone);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });

    it('Get inactive', () => {
      const clone = structuredClone(data);
      clone.active = false;

      try {
        new GetFightDto(clone);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
