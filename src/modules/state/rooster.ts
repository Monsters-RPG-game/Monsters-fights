import RoosterFactory from '../../tools/abstract/rooster';
import type { IStateEntity } from './entity';
import type State from './model';
import type { IState } from './types';
import type { EModules } from '../../enums';

export default class Rooster extends RoosterFactory<IState, typeof State, EModules.States> {
  async getMany(ids: string[]): Promise<IStateEntity[]> {
    return this.model
      .find({ _id: { $in: ids } })
      .select({ __v: false })
      .lean();
  }
}
