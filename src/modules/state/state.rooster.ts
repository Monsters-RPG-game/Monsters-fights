import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { State } from './state.schema';
import type { IStateEntity } from './log.entity';
import type { ICreateStateDto } from './state.types';

@Injectable()
export default class StateRooster {
  constructor(@InjectModel(State.name) private state: Model<State>) {
    //
  }

  async add(data: ICreateStateDto): Promise<string> {
    const newElement = new this.state({ initialized: { teams: data.teams }, current: { teams: data.teams } });
    const callback = await newElement.save();
    return callback._id.toString();
  }

  async update(id: string, data: Partial<IStateEntity>): Promise<void> {
    await this.state.findOneAndUpdate({ _id: id }, data);
  }

  async get(_id: unknown): Promise<IStateEntity | null> {
    return this.state.findOne({ _id }).lean();
  }
}
