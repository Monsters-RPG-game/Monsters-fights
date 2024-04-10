import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Rooster from '../../src/modules/messagesDetails/rooster';
import fakeData from '../utils/fakeData.json';
import FakeFactory from '../utils/fakeFactory/src';
import { IFullError } from '../../src/types';
import { MongoIncorrectMinLengthError, MongoMissingError } from '../utils/errors';
import { IMessageDetailsEntity } from '../../src/modules/messagesDetails/entity';
import MessageDetails from '../../src/modules/messagesDetails/model';

describe('Details - add', () => {
  const db = new FakeFactory();
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const rooster = new Rooster(MessageDetails);

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    describe('Missing message', () => {
      it(`Missing message`, async () => {
        const clone = structuredClone(fakeDetails);
        clone.message = undefined!;

        try {
          await rooster.add({ message: clone.message });
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoMissingError('Details', 'message');
          expect(error.message).toEqual(target.message);
        }
      });
    });

    describe('Incorrect data', () => {
      it(`Receiver incorrect`, async () => {
        const clone = structuredClone(fakeDetails);
        clone.message = 'x';

        try {
          await rooster.add({ message: clone.message });
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoIncorrectMinLengthError('Details', 'message', 2);
          expect(error.message).toEqual(target.message);
        }
      });
    });
  });

  describe('Should pass', () => {
    it(`Add message`, async () => {
      await rooster.add({ message: fakeDetails.message });

      const messages = await rooster.getAll(1);
      const message = messages[0]!;

      expect(messages.length).toEqual(1);
      expect(message.message).toEqual(fakeDetails.message);
    });
  });
});
