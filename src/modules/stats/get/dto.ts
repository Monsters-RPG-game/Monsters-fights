import Validation from '../../../tools/validation';
import type { IGetStatsDto } from './types';

export default class GetStatsDto implements IGetStatsDto {
  characters: string[];

  constructor(data: IGetStatsDto) {
    this.characters = data.characters;

    this.validate();
  }

  private validate(): void {
    new Validation(this.characters, 'characters').isDefined().isObjectIdArray();
  }
}
