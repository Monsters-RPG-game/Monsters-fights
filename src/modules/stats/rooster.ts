import RoosterFactory from '../../tools/abstract/rooster';
import type { IStatsEntity } from './entity';
import type { IGetStatsDto } from './get/types';
import type Stats from './model';
import type { IStats } from './types';
import type { EModules } from '../../enums';

export default class Rooster extends RoosterFactory<IStats, typeof Stats, EModules.Stats> {
  async getMany(params: IGetStatsDto): Promise<IStatsEntity[]> {
    return this.model
      .find({ character: { $in: params.characters } })
      .select({ __v: false, _id: false })
      .lean();
  }
}
