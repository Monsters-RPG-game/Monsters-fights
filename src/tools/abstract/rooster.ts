import type { IRoosterAddData, IRoosterFactory, IRoosterGetAllData, IRoosterGetData, IRoosterUpdate } from './types';
import type { EModules } from '../../enums';
import type { Document, FilterQuery, Model } from 'mongoose';

export default abstract class RoosterFactory<T extends Document, U extends Model<T>, Z extends EModules>
  implements IRoosterFactory<Z>
{
  private readonly _model: U;

  constructor(model: U) {
    this._model = model;
  }

  get model(): U {
    return this._model;
  }

  async add(data: IRoosterAddData[Z]): Promise<string> {
    const newElement = new this.model(data);
    const callback = await newElement.save();
    return callback._id as string;
  }

  async get(_id: unknown): Promise<IRoosterGetData[Z] | null> {
    return this.model.findOne({ _id }).lean();
  }

  async getAll(page: number): Promise<IRoosterGetAllData[Z]> {
    return this.model
      .find({})
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean();
  }

  async update(id: string, data: IRoosterUpdate[Z]): Promise<void> {
    await this.model.findOneAndUpdate({ _id: id } as FilterQuery<Record<string, unknown>>, data);
  }
}
