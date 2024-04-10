import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import { ISendMessageDto } from '../../../src/modules/messages/send/types';
import SendMessageDto from '../../../src/modules/messages/send/dto';

describe('Message - send', () => {
  const send: ISendMessageDto = {
    body: 'asd',
    receiver: '63e55edbe8a800060931121e',
    sender: '63e55edbe8a800060931121e',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing body`, () => {
        const clone = structuredClone(send);
        clone.body = undefined!;

        try {
          new SendMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('body'));
        }
      });

      it(`Missing receiver`, () => {
        const clone = structuredClone(send);
        clone.receiver = undefined!;

        try {
          new SendMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('receiver'));
        }
      });

      it(`Missing sender`, () => {
        const clone = structuredClone(send);
        clone.sender = undefined!;

        try {
          new SendMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('sender'));
        }
      });
    });

    describe('Incorrect data', () => {
      it(`Receiver incorrect type`, () => {
        const clone = structuredClone(send);
        clone.receiver = 'asd';

        try {
          new SendMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('receiver should be objectId'));
        }
      });

      it(`Sender incorrect type`, () => {
        const clone = structuredClone(send);
        clone.sender = 'asd';

        try {
          new SendMessageDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('sender should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it(`send`, () => {
      const clone = structuredClone(send);
      try {
        new SendMessageDto(clone);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
