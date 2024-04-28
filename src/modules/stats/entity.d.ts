import type { ICharacterStats } from '../../types/characters';

export interface IStatsEntity {
  _id: string;
  character: string;
  lvl: number;
  stats: ICharacterStats;
}
