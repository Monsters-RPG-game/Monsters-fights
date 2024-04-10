import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import { IReadMessageDto } from '../../../src/modules/messages/read/types';
import ReadMessageDto from '../../../src/modules/messages/read/dto';

describe('Message - read', () => {
  const read: IReadMessageDto = { chatId: '63e55edbe8a800060911121d', user: '63e55edbe8a800060911121d' };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing id`, () => {
        const clone = structuredClone(read);
        clone.chatId = undefined!;

        try {
          new ReadMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('chatId'));
        }
      });

      it(`Missing user`, () => {
        const clone = structuredClone(read);
        clone.user = undefined!;
        try {
          new ReadMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('user'));
        }
      });
    });

    describe('Incorrect data', () => {
      it(`Id incorrect type`, () => {
        const clone = structuredClone(read);
        clone.chatId = 'id';

        try {
          new ReadMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('chatId should be objectId'));
        }
      });

      it(`User incorrect type`, () => {
        const clone = structuredClone(read);
        clone.user = 'bc';

        try {
          new ReadMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('user should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it(`Read`, () => {
      const clone = structuredClone(read);
      try {
        new ReadMessageDto(clone);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
