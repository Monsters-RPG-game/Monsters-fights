import type { ESkillsType } from '../../../enums';
import type { ISingleSkillDetailed } from 'modules/skills/types';

export interface IBaseAttackDto {
  target: string;
  externalPower?: number;
  skill?: ISingleSkillDetailed;
  type: ESkillsType;
}

export interface IBaseDamage {
  dmg: number;
}
