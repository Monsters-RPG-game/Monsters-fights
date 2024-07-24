import Validation from '../../../tools/validation';
import type { IGetSkillsDto } from './types';

export default class GetSkillsDto implements IGetSkillsDto {
  id: string;

  constructor(data: IGetSkillsDto) {
    this.id = data.id;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isObjectId();
  }
}
