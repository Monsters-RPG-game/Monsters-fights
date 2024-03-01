import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './log.schema';
import type { ILogEntity } from './log.entity';

@Injectable()
export default class LogRooster {
  constructor(@InjectModel(Log.name) private log: Model<Log>) {
    //
  }

  async addBasic(): Promise<string> {
    const newElement = new this.log({ logs: [] });
    const callback = await newElement.save();
    return callback._id.toString();
  }

  async update(id: string, data: Partial<ILogEntity>): Promise<void> {
    await this.log.findOneAndUpdate({ _id: id }, data);
  }

  async get(_id: string): Promise<ILogEntity | null> {
    return this.log.findOne({ _id }).lean();
  }
}
