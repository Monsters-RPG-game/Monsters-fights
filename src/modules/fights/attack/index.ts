import { ESkillsType } from '../../../enums';
import ControllerFactory from '../../../tools/abstract/controller';
import Log from '../../../tools/logger';
import BaseAttackController from '../baseAttack';
import BaseAttackDto from '../baseAttack/dto';
import Fight from '../model';
import Rooster from '../rooster';
import type { IAttackDto } from './types';
import type { EModules, EFightStatus } from '../../../enums';
import type { IActionEntity } from '../../actions/entity';
import type { Omit } from 'yargs';

export default class Controller extends ControllerFactory<EModules.Fights> {
  private _baseAttack: BaseAttackController;
  constructor() {
    super(new Rooster(Fight));
    this._baseAttack = new BaseAttackController();
  }

  public get baseAttack(): BaseAttackController {
    return this._baseAttack;
  }

  async attack(
    data: IAttackDto,
    userId: string,
  ): Promise<{ logs: Omit<IActionEntity, '_id'>[]; status: EFightStatus }> {
    const baseAttackDto = new BaseAttackDto({ target: data.target, type: ESkillsType.Attack });
    Log.log('Attack', 'Got new attack:', data.target);
    return this.baseAttack.baseAttack(baseAttackDto, userId);
  }
}
