import type { IActionEntity } from '../../../../src/modules/actions/entity';
import type Action from '../../../../src/modules/actions/model';
import type { IFightEntity } from '../../../../src/modules/fights/entity';
import type Fight from '../../../../src/modules/fights/model';
import type { ILogEntity } from '../../../../src/modules/log/entity';
import type Log from '../../../../src/modules/log/model';
import type { IStateEntity } from '../../../../src/modules/state/entity';
import type State from '../../../../src/modules/state/model';
import type { IStatsEntity } from '../../../../src/modules/stats/entity';
import type Stats from '../../../../src/modules/stats/model';
import type { EFakeData } from '../enums';

export type IFakeParam<T> = {
  [P in keyof T]?: T[P];
};

export interface IFakeState {
  [EFakeData.Actions]: IFakeParam<IActionEntity>;
  [EFakeData.Fights]: IFakeParam<IFightEntity>;
  [EFakeData.Logs]: IFakeParam<ILogEntity>;
  [EFakeData.States]: IFakeParam<IStateEntity>;
  [EFakeData.Stats]: IFakeParam<IStatsEntity>;
}

export interface IFakeModel {
  [EFakeData.Actions]: typeof Action;
  [EFakeData.Fights]: typeof Fight;
  [EFakeData.Logs]: typeof Log;
  [EFakeData.States]: typeof State;
  [EFakeData.Stats]: typeof Stats;
}

export type IAbstractBody<T> = {
  [P in keyof T]: ([arg]?: typeof P) => this;
};
