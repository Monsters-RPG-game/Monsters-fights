import type { ISingleSkillDetailed } from '../types';

export interface ICreateSkillsDto {
  owner: string;
  singleSkills: ISingleSkillDetailed[];
}
