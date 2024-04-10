import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Rooster from '../../src/modules/chat/rooster';
import fakeData from '../utils/fakeData.json';
import { IMessageEntity } from '../../src/modules/messages/entity';
import FakeFactory from '../utils/fakeFactory/src';
import { IMessageDetailsEntity } from '../../src/modules/messagesDetails/entity';
import Chat from '../../src/modules/chat/model';

describe('Chat - get', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.chatMessages[0] as IMessageEntity;
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

      const messages = await rooster.getByOwner(fakeMessage.sender, 1);
      const message = messages[0]!;

      expect(messages.length).toEqual(1);
      expect(message.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(message.sender.toString()).toEqual(fakeMessage.sender);
      expect(message.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(message.type).toEqual(fakeMessage.type);
    });

    it(`Get one`, async () => {
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

      const message = await rooster.getOne(fakeMessage.sender, fakeMessage.receiver);

      expect(message?.chatId.toString()).toEqual(fakeMessage.chatId);
    });

    it(`Get unread`, async () => {
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

      const messages = await rooster.getUnread(fakeMessage.sender, 1);
      const message = messages[0]!;

      expect(messages.length).toEqual(1);
      expect(message.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(message.sender.toString()).toEqual(fakeMessage.sender);
      expect(message.receiver.toString()).toEqual(fakeMessage.receiver);
    });

    it(`Get one by chatId`, async () => {
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

      const message = await rooster.getOneByChatId(fakeMessage.chatId, fakeMessage.receiver);
      expect(message?.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(message?.sender.toString()).toEqual(fakeMessage.sender);
      expect(message?.read).toEqual(fakeMessage.read);
    });

    it(`Get with details`, async () => {
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

      const messages = await rooster.getWithDetails(fakeMessage.chatId, 1);
      const message = messages[0]!;

      expect(messages.length).toEqual(1);
      expect(message.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(message.sender.toString()).toEqual(fakeMessage.sender);
      expect(message.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(message.read).toEqual(fakeMessage.read);
      expect(message.message).toEqual(fakeDetails.message);
    });
  });
});
