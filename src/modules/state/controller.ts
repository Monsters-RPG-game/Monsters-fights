import StateModel from './model';
import Rooster from './rooster';
import ControllerFactory from '../../tools/abstract/controller';
import type { ICreateStateDto } from './create/types';
import type { IStateEntity } from './entity';
import type { EModules } from '../../enums';

export default class State extends ControllerFactory<EModules.States> {
  constructor() {
    super(new Rooster(StateModel));
  }

  get(id: string): Promise<IStateEntity | null> {
    return this.rooster.get(id);
  }

  getMany(id: string[]): Promise<IStateEntity[]> {
    return this.rooster.getMany(id);
  }

  update(id: string, data: Partial<IStateEntity>): Promise<void> {
    return this.rooster.update(id, data);
  }

  add(data: ICreateStateDto): Promise<string> {
    return this.rooster.add(data);
  }
}
