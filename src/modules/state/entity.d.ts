import type { IStateTeam } from './types';

export interface IStateEntity {
  _id: string;
  initialized: { teams: IStateTeam[][] };
  current: { teams: IStateTeam[][] };
}
