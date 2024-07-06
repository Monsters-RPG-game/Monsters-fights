import Validation from '../../../tools/validation';
import type { ICreateSkillsDto } from './types';
import type { ISingleSkillDetailed } from '../types';

export default class CreateStatsDto implements ICreateSkillsDto {
  owner: string;
  singleSkills: ISingleSkillDetailed[];

  constructor(data: ICreateSkillsDto) {
    this.owner = data.owner;
    this.singleSkills = data.singleSkills;
    this.validate();
  }
  private validate(): void {
    new Validation(this.owner, 'owner').isDefined().isObjectId();
    new Validation(this.singleSkills, 'singleSkills').isDefined().isArray();
  }
}
