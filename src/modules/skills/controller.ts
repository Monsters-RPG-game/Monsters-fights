import SkillsModel from './model';
import Rooster from './rooster';
import ControllerFactory from '../../tools/abstract/controller';
import type { ICreateSkillsDto } from './create/types';
import type { ISkillsEntity } from './entity';
import type { EModules } from '../../enums';

export default class Skills extends ControllerFactory<EModules.Skills> {
  constructor() {
    super(new Rooster(SkillsModel));
  }

  getMany(ids: string[]): Promise<ISkillsEntity[]> {
    return this.rooster.getMany(ids);
  }
  add(data: ICreateSkillsDto): Promise<string> {
    return this.rooster.add(data);
  }
}
