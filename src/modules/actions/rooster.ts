import RoosterFactory from '../../tools/abstract/rooster';
import type { IActionEntity } from './entity';
import type Action from './model';
import type { IAction } from './types';
import type { EModules } from '../../enums';

export default class Rooster extends RoosterFactory<IAction, typeof Action, EModules.Actions> {
  async getMany(ids: string[]): Promise<IActionEntity[]> {
    return this.model
      .find({ _id: { $in: ids } })
      .select({ __v: false, _id: false })
      .lean();
  }
}
