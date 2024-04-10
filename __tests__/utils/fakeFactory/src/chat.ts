import TemplateFactory from './abstracts';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';
import { IMessageEntity } from '../../../../src/modules/messages/entity';
import { EMessageTargets } from '../../../../src/enums';
import Chat from '../../../../src/modules/chat/model';

export default class FakeChat extends TemplateFactory<EFakeData.Chat> implements IAbstractBody<IMessageEntity> {
  constructor() {
    super(Chat);
  }

  _id(id: string): this {
    this.state._id = id;
    return this;
  }

  body(body: string): this {
    this.state.body = body;
    return this;
  }

  receiver(receiver: string): this {
    this.state.receiver = receiver;
    return this;
  }

  sender(sender: string): this {
    this.state.sender = sender;
    return this;
  }

  read(read: boolean): this {
    this.state.read = read;
    return this;
  }

  type(type: EMessageTargets): this {
    this.state.type = type;
    return this;
  }

  chatId(id?: string): this {
    this.state.chatId = id;
    return this;
  }

  createdAt(createdAt: string): this {
    this.state.createdAt = createdAt;
    return this;
  }

  updatedAt(updatedAt: string): this {
    this.state.updatedAt = updatedAt;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      _id: undefined,
      body: undefined,
      read: false,
      sender: undefined,
      receiver: undefined,
      type: EMessageTargets.Messages,
      chatId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }
}
