import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import { IGetMessageDto } from '../../../src/modules/messages/get/types';
import GetMessageDto from '../../../src/modules/messages/get/dto';

describe('Message - get', () => {
  const get: IGetMessageDto = { page: 1 };
  const getWithData: IGetMessageDto = { target: '63e55edbe8a800060911121d', page: 1 };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing page`, () => {
        const clone = structuredClone(get);
        clone.page = undefined!;

        try {
          new GetMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('page'));
        }
      });
    });

    describe('Incorrect data', () => {
      it(`Page incorrect type`, () => {
        const clone = structuredClone(get);
        clone.page = 'bc' as unknown as number;

        try {
          new GetMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('page should be number'));
        }
      });

      it(`Target incorrect type`, () => {
        const clone = structuredClone(getWithData);
        clone.target = 'bc';

        try {
          new GetMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('target should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it(`Get multi`, () => {
      const clone = structuredClone(get);

      try {
        new GetMessageDto(clone);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
