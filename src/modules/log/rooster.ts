import RoosterFactory from '../../tools/abstract/rooster';
import type { ILog } from './types';
import type { EModules } from '../../enums';
import type Log from '../log/model';

export default class Rooster extends RoosterFactory<ILog, typeof Log, EModules.Logs> {
  async addBasic(): Promise<string> {
    const newElement = new this.model({ logs: [] });
    const callback = await newElement.save();
    return callback._id.toString();
  }
}
