import type { EFakeData } from '../enums';
import Action from '../../../../src/modules/actions/model';
import Fight from '../../../../src/modules/fights/model';
import Log from '../../../../src/modules/log/model';
import State from '../../../../src/modules/state/model';
import { IActionEntity } from '../../../../src/modules/actions/entity';
import { IFightEntity } from '../../../../src/modules/fights/entity';
import { ILogEntity } from '../../../../src/modules/log/entity';
import { IStateEntity } from '../../../../src/modules/state/entity';

export type IFakeParam<T> = {
  [P in keyof T]?: T[P];
};

export interface IFakeState {
  [EFakeData.Actions]: IFakeParam<IActionEntity>;
  [EFakeData.Fights]: IFakeParam<IFightEntity>;
  [EFakeData.Logs]: IFakeParam<ILogEntity>;
  [EFakeData.States]: IFakeParam<IStateEntity>;
}

export interface IFakeModel {
  [EFakeData.Actions]: typeof Action;
  [EFakeData.Fights]: typeof Fight;
  [EFakeData.Logs]: typeof Log;
  [EFakeData.States]: typeof State;
}

export type IAbstractBody<T> = {
  [P in keyof T]: ([arg]?: typeof P) => this;
};
