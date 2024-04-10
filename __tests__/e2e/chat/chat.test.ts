import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ILocalUser, IPreparedMessagesBody } from '../../../src/types';
import GetController from '../../../src/modules/chat/get';
import SendController from '../../../src/modules/chat/send';
import ReadController from '../../../src/modules/chat/read';
import { EUserTypes } from '../../../src/enums';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import { IFullMessageEntity, IMessageEntity } from '../../../src/modules/messages/entity';
import { IMessageDetailsEntity } from '../../../src/modules/messagesDetails/entity';
import FakeFactory from '../../utils/fakeFactory/src';
import { IGetChatMessageDto } from '../../../src/modules/chat/get/types';
import { IReadChatMessageDto } from '../../../src/modules/chat/read/types';
import { ISendChatMessageDto } from '../../../src/modules/chat/send/types';

describe('Chat', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.chatMessages[0] as IMessageEntity;
  const fakeMessage2 = fakeData.chatMessages[1] as IMessageEntity;
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const fakeDetails2 = fakeData.details[1] as IMessageDetailsEntity;
  const localUser: ILocalUser = {
    userId: fakeMessage.sender,
    tempId: 'tempId',
    validated: true,
    type: EUserTypes.User,
  };
  const messageReceiver: ILocalUser = {
    userId: fakeMessage.receiver,
    tempId: 'tempId',
    validated: true,
    type: EUserTypes.User,
  };
  const get: IGetChatMessageDto = { page: 1, target: fakeMessage.chatId };
  const getMany: IGetChatMessageDto = { page: 1 };
  const read: IReadChatMessageDto = { chatId: fakeMessage.chatId, user: fakeMessage.receiver };
  const send: ISendChatMessageDto = {
    body: fakeDetails.message,
    receiver: fakeMessage.sender,
    sender: fakeMessage.receiver,
  };
  const getController = new GetController();
  const sendController = new SendController();
  const readController = new ReadController();

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
    describe('No data passed', () => {
      it(`Get one - missing page`, () => {
        const clone = structuredClone(get);
        clone.page = undefined!;
        getController.get(clone, new mongoose.Types.ObjectId().toString()).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('page'));
        });
      });

      it(`Read - missing user`, () => {
        const clone = structuredClone(read);
        clone.user = undefined!;
        readController.read(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('user'));
        });
      });

      it(`Read - missing id`, () => {
        const clone = structuredClone(read);
        clone.chatId = undefined!;
        readController.read(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('chatId'));
        });
      });

      it(`Send - missing body`, () => {
        const clone = structuredClone(send);
        clone.body = undefined!;
        sendController.send(clone, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('body'));
        });
      });

      it(`Send - missing receiver`, () => {
        const clone = structuredClone(send);
        clone.receiver = undefined!;
        sendController.send(clone, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('receiver'));
        });
      });

      it(`Send - missing sender`, () => {
        const clone = structuredClone(send);
        clone.sender = undefined!;
        sendController.send(clone, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('sender'));
        });
      });

      it(`Get many - missing page`, () => {
        const clone = structuredClone(getMany);
        clone.page = undefined!;
        getController.get(clone, new mongoose.Types.ObjectId().toString()).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('page'));
        });
      });

      it(`Get unread - missing page`, () => {
        const clone = structuredClone(getMany);
        clone.page = undefined!;
        getController.getUnread(clone, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('page'));
        });
      });
    });

    describe('Incorrect data', () => {
      beforeEach(async () => {
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
      });

      afterEach(async () => {
        await db.cleanUp();
      });

      it(`Get one - page incorrect type`, () => {
        const clone = structuredClone(get);
        clone.page = 'asd' as unknown as number;

        getController.get(clone, new mongoose.Types.ObjectId().toString()).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('page should be number'));
        });
      });

      it(`Read - user incorrect type`, () => {
        const clone = structuredClone(read);
        clone.user = 'asd';

        readController.read(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('user should be objectId'));
        });
      });

      it(`Read - id incorrect type`, () => {
        const clone = structuredClone(read);
        clone.chatId = 'asd';

        readController.read(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('chatId should be objectId'));
        });
      });

      it(`Send - body too short`, () => {
        const clone = structuredClone(send);
        clone.body = 'a';

        sendController.send(clone, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('body', 2, 1000));
        });
      });

      it(`Send - receiver incorrect type`, () => {
        const clone = structuredClone(send);
        clone.receiver = 'abc';

        sendController.send(clone, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('receiver should be objectId'));
        });
      });

      it(`Send - sender incorrect type`, () => {
        const clone = structuredClone(send);
        clone.sender = 'abc';

        sendController.send(clone, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('sender should be objectId'));
        });
      });

      it(`Get many - page incorrect type`, () => {
        const clone = structuredClone(getMany);
        clone.page = 'a' as unknown as number;

        getController.get(clone, new mongoose.Types.ObjectId().toString()).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('page should be number'));
        });
      });

      it(`Get unread - page incorrect type`, () => {
        const clone = structuredClone(getMany);
        clone.page = 'abc' as unknown as number;

        getController.getUnread(clone, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('page should be number'));
        });
      });

      it(`Send - cannot send message to yourself`, () => {
        const clone = structuredClone(send);
        clone.sender = localUser.userId;

        sendController.send(clone, localUser.userId).catch((err) => {
          expect(err).toEqual(new errors.ActionNotAllowed());
        });
      });
    });
  });

  describe('Should pass', () => {
    beforeEach(async () => {
      await db.chat
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .chatId(fakeMessage.chatId)
        .type(fakeMessage.type)
        ._id(fakeMessage._id)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.chat
        ._id(fakeMessage2._id)
        .chatId(fakeMessage2.chatId)
        .type(fakeMessage2.type)
        .sender(fakeMessage2.sender)
        .body(fakeMessage2.body)
        .read(fakeMessage2.read)
        .receiver(fakeMessage2.receiver)
        .create();
      await db.messageDetails._id(fakeDetails._id).message(fakeDetails.message).create();
      await db.messageDetails._id(fakeDetails2._id).message(fakeDetails2.message).create();
    });

    afterEach(async () => {
      await db.cleanUp();
    });

    it(`Get one`, async () => {
      const data = (await getController.get(get, localUser.userId)) as IFullMessageEntity[];
      const elm = data[0]!;

      expect(data.length).toEqual(2);
      expect(elm.read).toEqual(fakeMessage.read);
      expect(elm.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(elm.sender.toString()).toEqual(fakeMessage.sender);
      expect(elm.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(elm.message).toEqual(fakeDetails.message);
    });

    it(`Get many`, async () => {
      const data = (await getController.get(getMany, localUser.userId)) as Record<string, IPreparedMessagesBody>;
      const target = Object.keys(data)[0]!;
      const elm = data[target]!;

      expect(Object.keys(data).length).toEqual(1);
      expect(elm.sender.toString()).toEqual(fakeMessage.sender);
      expect(elm.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(elm.messages).toEqual(1);
    });

    it(`Get unread`, async () => {
      const data = await getController.getUnread(getMany, messageReceiver.userId);
      const elm = data[0]!;

      expect(data.length).toEqual(1);
      expect(elm.participants.includes(fakeMessage.sender)).toEqual(true);
      expect(elm.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(elm.unread).toEqual(1);
    });

    it(`Read`, async () => {
      const before = await getController.getUnread(getMany, messageReceiver.userId);
      expect(before.length).toEqual(1);

      await readController.read(read);

      const after = await getController.getUnread(getMany, messageReceiver.userId);
      expect(after.length).toEqual(0);
    });

    it(`Send`, async () => {
      await sendController.send(send, fakeMessage.receiver);

      const data = await getController.get(getMany, localUser.userId);
      const key = Object.keys(data)[0]!;

      expect(data[key].messages).toEqual(2);
    });
  });
});
