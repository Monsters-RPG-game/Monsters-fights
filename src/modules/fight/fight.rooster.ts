import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return this.fight.findOne({ attacker, active: true }).lean();
  }
}
