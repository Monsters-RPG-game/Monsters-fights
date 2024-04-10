import type { EFakeData } from '../enums';
import type Messages from '../../../../src/modules/messages/model';
import type Details from '../../../../src/modules/messagesDetails/model';
import { IMessageEntity } from '../../../../src/modules/messages/entity';
import { IMessageDetailsEntity } from '../../../../src/modules/messagesDetails/entity';
import Chat from '../../../../src/modules/chat/model';

export type IFakeParam<T> = {
  [P in keyof T]?: T[P];
};

export interface IFakeState {
  [EFakeData.Messages]: IFakeParam<IMessageEntity>;
  [EFakeData.MessageDetails]: IFakeParam<IMessageDetailsEntity>;
  [EFakeData.Chat]: IFakeParam<IMessageEntity>;
}

export interface IFakeModel {
  [EFakeData.Messages]: typeof Messages;
  [EFakeData.MessageDetails]: typeof Details;
  [EFakeData.Chat]: typeof Chat;
}

export type IAbstractBody<T> = {
  [P in keyof T]: ([arg]?: typeof P) => this;
};
