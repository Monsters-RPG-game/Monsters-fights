import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Rooster from '../../src/modules/messagesDetails/rooster';
import fakeData from '../utils/fakeData.json';
import FakeFactory from '../utils/fakeFactory/src';
import { IMessageDetailsEntity } from '../../src/modules/messagesDetails/entity';
import Details from '../../src/modules/messagesDetails/model';

describe('Details - get', () => {
  const db = new FakeFactory();
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const rooster = new Rooster(Details);

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
    describe('Missing data', () => {
      it(`Missing data`, async () => {
        const message = await rooster.getIn('_id', [fakeDetails._id]);
        expect(message.length).toEqual(0);
      });
    });
  });

  describe('Should pass', () => {
    it(`Get all`, async () => {
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      const allDetails = await rooster.getAll(1);
      const details = allDetails[0]!;

      expect(allDetails.length).toEqual(1);
      expect(details.message).toEqual(fakeDetails.message);
      expect(details._id.toString()).toEqual(fakeDetails._id);
    });

    it(`Get one`, async () => {
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      const allDetails = await rooster.getIn('_id', [fakeDetails._id]);
      const details = allDetails[0]!;

      expect(allDetails.length).toEqual(1);
      expect(details._id.toString()).toEqual(fakeDetails._id);
      expect(details.message).toEqual(fakeDetails.message);
    });
  });
});
