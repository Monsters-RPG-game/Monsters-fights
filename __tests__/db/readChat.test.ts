import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Rooster from '../../src/modules/chat/rooster';
import fakeData from '../utils/fakeData.json';
import { IMessageEntity } from '../../src/modules/messages/entity';
import FakeFactory from '../utils/fakeFactory/src';
import { IMessageDetailsEntity } from '../../src/modules/messagesDetails/entity';
import Chat from '../../src/modules/chat/model';

describe('Chat - read', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.messages[0] as IMessageEntity;
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const rooster = new Rooster(Chat);

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
        const message = await rooster.getByOwner(fakeMessage.sender, 1);
        expect(message.length).toEqual(0);
      });
    });
  });

  describe('Should pass', () => {
    it(`Get all`, async () => {
      await db.chat
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .chatId(fakeMessage.chatId)
        .type(fakeMessage.type)
        ._id(fakeMessage._id)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      await rooster.update(fakeMessage.chatId, fakeMessage.sender, { read: true });
      const message = await rooster.getOneByChatId(fakeMessage.chatId, fakeMessage.receiver);

      expect(message?.read).toEqual(true);
    });
  });
});
