import { ESkillsType } from '../../../enums';
import Validation from '../../../tools/validation';
import type { IBaseAttackDto } from './types';
import type { ISingleSkillDetailed } from '../../skills/types';

export default class BaseAttackDto implements IBaseAttackDto {
  target: string;
  externalPower: number;
  type: ESkillsType;
  skill?: ISingleSkillDetailed | undefined;

  constructor(data: IBaseAttackDto) {
    this.target = data.target!;
    this.externalPower = data.externalPower ?? 1;
    this.type = data.type;
    this.skill = data.skill;

    this.validate();
  }

  private validate(): void {
    new Validation(this.target, 'target').isDefined().isObjectId();
    new Validation(this.type, 'type').isDefined().isPartOfEnum(ESkillsType);
    if (this.externalPower) {
      new Validation(this.externalPower, 'externalPower').isDefined().isNumber();
    }

    if (this.skill) {
      new Validation(this.skill, 'skill').isDefined();
    }
  }
}
