import RoosterFactory from '../../tools/abstract/rooster';
import type { ISkillsEntity } from './entity';
import type Skills from './model';
import type { ISkills } from './types';
import type { EModules } from '../../enums';

export default class Rooster extends RoosterFactory<ISkills, typeof Skills, EModules.Skills> {
  async getMany(ids: string[]): Promise<ISkillsEntity[]> {
    return this.model
      .find({ _id: { $in: ids } })
      .select({ __v: false })
      .lean();
  }
}
