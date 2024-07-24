import type { ISingleSkillDetailed } from './types';

export interface ISkillsEntity {
  _id: string;
  owner: string;
  singleSkills: ISingleSkillDetailed[];
}
