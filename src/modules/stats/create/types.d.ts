import type { IFightCharacterEntity } from '../../../types/characters';

export interface ICreateStatsDto extends Omit<IFightCharacterEntity, '_id'> {
  character: string;
}
