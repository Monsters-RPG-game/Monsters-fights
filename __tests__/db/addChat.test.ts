import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Rooster from '../../src/modules/chat/rooster';
import fakeData from '../utils/fakeData.json';
import { IGetOneMessageEntity, IMessageEntity } from '../../src/modules/messages/entity';
import FakeFactory from '../utils/fakeFactory/src';
import { IFullError, INewMessage } from '../../src/types';
import { EMessageTargets } from '../../src/enums';
import { MongoIncorrectEnumError, MongoMissingError, MongoNotObjectIdError } from '../utils/errors';
import Chat from '../../src/modules/chat/model';

describe('Chat - add', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.messages[0] as IMessageEntity;
  const rooster = new Rooster(Chat);
  const newMessage: INewMessage = {
    owner: fakeMessage.sender,
    type: fakeMessage.type,
    chatId: fakeMessage.chatId,
    body: fakeMessage.body,
    receiver: fakeMessage.receiver,
    sender: fakeMessage.sender,
  };

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
      it(`Missing receiver`, async () => {
        const clone = structuredClone(newMessage);
        clone.receiver = undefined!;
        try {
          await rooster.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoMissingError('Chat', 'receiver');
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await rooster.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`Missing body`, async () => {
        const clone = structuredClone(newMessage);
        clone.body = undefined!;

        try {
          await rooster.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoMissingError('Chat', 'body');
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await rooster.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`Missing sender`, async () => {
        const clone = structuredClone(newMessage);
        clone.sender = undefined!;

        try {
          await rooster.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoMissingError('Chat', 'sender');
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await rooster.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`Missing chatId`, async () => {
        const clone = structuredClone(newMessage);
        clone.chatId = undefined!;

        try {
          await rooster.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoMissingError('Chat', 'chatId');
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await rooster.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });
    });

    describe('Incorrect data', () => {
      it(`Receiver incorrect`, async () => {
        const clone = structuredClone(newMessage);
        clone.receiver = 'x';

        try {
          await rooster.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoNotObjectIdError('Chat', 'receiver', clone.receiver);
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await rooster.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`Sender incorrect`, async () => {
        const clone = structuredClone(newMessage);
        clone.sender = 'x';

        try {
          await rooster.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoNotObjectIdError('Chat', 'sender', clone.sender);
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await rooster.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`Body incorrect`, async () => {
        const clone = structuredClone(newMessage);
        clone.body = 'x';

        try {
          await rooster.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoNotObjectIdError('Chat', 'body', clone.body);
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await rooster.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`Type incorrect`, async () => {
        const clone = structuredClone(newMessage);
        clone.type = 'x' as EMessageTargets;

        try {
          await rooster.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoIncorrectEnumError('Chat', 'type', clone.type);
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await rooster.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`ChatId incorrect`, async () => {
        const clone = structuredClone(newMessage);
        clone.chatId = 'x';

        try {
          await rooster.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoNotObjectIdError('Chat', 'chatId', clone.chatId);
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await rooster.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });
    });
  });

  describe('Should pass', () => {
    it(`Add message`, async () => {
      await rooster.add(newMessage);

      const { chatId, receiver } = newMessage;
      const message = (await rooster.getOneByChatId(chatId, receiver)) as IGetOneMessageEntity;

      expect(message).not.toEqual(null);
      expect(message.sender.toString()).toEqual(newMessage.sender);
      expect(message.chatId.toString()).toEqual(newMessage.chatId);
    });
  });
});
