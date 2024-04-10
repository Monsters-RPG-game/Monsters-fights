import mongoose from 'mongoose';
import RoosterFactory from '../../tools/abstract/rooster';
import type { IFightEntity } from './entity';
import type Fight from './model';
import type { IFight } from './types';
import type { EModules } from '../../enums';

export default class Rooster extends RoosterFactory<IFight, typeof Fight, EModules.Fights> {
  async getActiveByUser(attacker: string): Promise<IFightEntity | null> {
    const data = await this.model
      .aggregate([
        {
          $match: {
            attacker: new mongoose.Types.ObjectId(attacker),
            active: true,
          },
        },
        {
          $addFields: { start: '$createdAt' },
        },
        {
          $project: {
            __v: 0,
            createdAt: 0,
          },
        },
      ])
      .limit(100)
      .sort({ createdAt: 1 });

    return !data || data.length === 0 ? null : (data[0] as IFightEntity);
  }

  async getByUser(attacker: string, page: number): Promise<IFightEntity[]> {
    const data = (await this.model
      .aggregate([
        {
          $match: { attacker: new mongoose.Types.ObjectId(attacker), active: false },
        },
        {
          $addFields: { start: '$createdAt', finish: '$updatedAt' },
        },
        {
          $project: {
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      ])
      .limit(10)
      .sort({ createdAt: 1 })
      .skip((page <= 0 ? 0 : page - 1) * 10)) as IFightEntity[];

    return !data || data.length === 0 ? [] : data;
  }
}
