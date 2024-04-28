import LogsModel from './model';
import Rooster from './rooster';
import ControllerFactory from '../../tools/abstract/controller';
import type { ILogEntity } from './entity';
import type { EModules } from '../../enums';

export default class Logs extends ControllerFactory<EModules.Logs> {
  constructor() {
    super(new Rooster(LogsModel));
  }

  get(id: string): Promise<ILogEntity | null> {
    return this.rooster.get(id);
  }

  update(id: string, data: Partial<ILogEntity>): Promise<void> {
    return this.rooster.update(id, data);
  }

  addBasic(): Promise<string> {
    return this.rooster.addBasic();
  }
}
