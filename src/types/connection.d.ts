import type * as types from './';
import type * as enums from '../enums';

export interface IRabbitMessage {
  user: types.ILocalUser;
  target: enums.EMessageTargets | enums.EMessageTypes;
  subTarget: enums.EMessagesTargets;
  payload: unknown;
}
