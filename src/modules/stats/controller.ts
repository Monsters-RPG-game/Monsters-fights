import StatsModel from './model';
import Rooster from './rooster';
import ControllerFactory from '../../tools/abstract/controller';
import type { ICreateStatsDto } from './create/types';
import type { IStatsEntity } from './entity';
import type { IGetStatsDto } from './get/types';
import type { EModules } from '../../enums';

export default class Stats extends ControllerFactory<EModules.Stats> {
  constructor() {
    super(new Rooster(StatsModel));
  }

  getMany(params: IGetStatsDto): Promise<IStatsEntity[]> {
    return this.rooster.getMany(params);
  }
  add(data: ICreateStatsDto): Promise<string> {
    return this.rooster.add(data);
  }
}
