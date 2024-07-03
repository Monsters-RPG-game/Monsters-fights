import UseSkillDto from './dto';
import { SkillsNotFound } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Log from '../../../tools/logger';
import State from '../../../tools/state';
import BaseAttackController from '../baseAttack';
import BaseAttackDto from '../baseAttack/dto';
import Fight from '../model';
import Rooster from '../rooster';
import type { IUseSkillDto } from './types';
import type { EFightStatus, EModules } from '../../../enums';
import type { IActionEntity } from '../../actions/entity';

export default class Controller extends ControllerFactory<EModules.Fights> {
  private readonly _baseAttack: BaseAttackController;

  constructor() {
    super(new Rooster(Fight));
    this._baseAttack = new BaseAttackController();
  }

  public get baseAttack(): BaseAttackController {
    return this._baseAttack;
  }

  async useSkill(
    data: IUseSkillDto,
    userId: string,
  ): Promise<{ logs: Omit<IActionEntity, '_id'>[]; status: EFightStatus }> {
    const payload = new UseSkillDto(data);
    Log.log('Attack', 'Using skill:', payload);
    const skills = await State.redis.getSkills(userId);
    if (!skills) throw new SkillsNotFound();

    const skill = skills.singleSkills.find((e) => e._id === data.skillId);
    if (!skill) throw new SkillsNotFound();

    const dto = new BaseAttackDto({
      target: payload.target,
      externalPower: skill.power,
      type: skill.type,
      skill,
    });
    // check type of skills
    // default is for not throwing err for now
    return this.baseAttack.baseAttack(dto, userId);
  }
}
