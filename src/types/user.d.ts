import type * as enums from '../enums';

export interface ILocalUser {
  userId: string;
  tempId: string;
  validated: boolean;
  type: enums.EUserTypes;
}
