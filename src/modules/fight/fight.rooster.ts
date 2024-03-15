import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Fight } from './fight.schema';
import type { IFightEntity } from './fight.entity';

@Injectable()
export default class FightRooster {
  constructor(@InjectModel(Fight.name) private fight: Model<Fight>) {
    //
  }

  async add(data: Omit<IFightEntity, '_id'>): Promise<string> {
    const newElement = new this.fight(data);
    const callback = await newElement.save();
    return callback._id.toString();
  }

  async update(id: string, data: Partial<IFightEntity>): Promise<void> {
    await this.fight.findOneAndUpdate({ _id: id }, data);
  }

  async get(_id: unknown): Promise<IFightEntity | null> {
    return this.fight.findOne({ _id }).lean();
  }

  async getActiveByUser(attacker: string): Promise<IFightEntity | null> {
    const data = await this.fight
      .aggregate([
        {
          $match: {
            attacker: new mongoose.Types.ObjectId(attacker),
            active: true,
          },
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
      .limit(100)
      .sort({ createdAt: 1 });

    return !data || data.length === 0 ? null : (data[0] as IFightEntity);
  }

  async getByUser(attacker: string, page: number): Promise<IFightEntity[]> {
    const data = (await this.fight
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
