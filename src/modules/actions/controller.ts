import ActionsModel from './model';
import Rooster from './rooster';
import ControllerFactory from '../../tools/abstract/controller';
import type { ICreateActionDto } from './create/types';
import type { IActionEntity } from './entity';
import type { EModules } from '../../enums';

export default class Actions extends ControllerFactory<EModules.Actions> {
  constructor() {
    super(new Rooster(ActionsModel));
  }

  getMany(params: string[]): Promise<IActionEntity[]> {
    return this.rooster.getMany(params);
  }
  add(data: Omit<ICreateActionDto, '_id'>): Promise<string> {
    return this.rooster.add(data);
  }
}
