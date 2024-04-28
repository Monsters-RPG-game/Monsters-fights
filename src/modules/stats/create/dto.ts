import Validation from '../../../tools/validation';
import type { ICreateStatsDto } from './types';
import type { ICharacterStats } from '../../../types/characters';

export default class CreateStatsDto implements ICreateStatsDto {
  character: string;
  lvl: number;
  stats: ICharacterStats;

  constructor(data: ICreateStatsDto) {
    this.character = data.character;
    this.lvl = data.lvl;
    this.stats = data.stats;

    this.validate();
  }

  private validate(): void {
    new Validation(this.character, 'character').isDefined().isObjectId();
    new Validation(this.lvl, 'lvl').isDefined().isNumber();
    new Validation(this.stats, 'stats').isDefined();
  }
}
