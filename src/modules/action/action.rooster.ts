import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action } from './action.schema';
import type { IActionEntity } from './action.entity';

@Injectable()
export default class FightRooster {
  constructor(@InjectModel(Action.name) private action: Model<Action>) {
    //
  }

  async add(data: Omit<IActionEntity, '_id'>): Promise<string> {
    const newElement = new this.action(data);
    const callback = await newElement.save();
    return callback._id.toString();
  }

  async update(id: string, data: Partial<IActionEntity>): Promise<void> {
    await this.action.findOneAndUpdate({ _id: id }, data);
  }

  async get(_id: unknown): Promise<IActionEntity | null> {
    return this.action.findOne({ _id }).lean();
  }
}
