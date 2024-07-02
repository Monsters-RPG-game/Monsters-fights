import TemplateFactory from './abstracts';
import * as enums from '../../../../src/enums';
import Skills from '../../../../src/modules/skills/model';
import type { ISkillsEntity } from '../../../../src/modules/skills/entity';
import type { ISingleSkillDetailed } from '../../../../src/modules/skills/types';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

export default class FakeStats extends TemplateFactory<EFakeData.Skills> implements IAbstractBody<ISkillsEntity> {
  constructor() {
    super(Skills);
  }

  _id(id: string): this {
    this.state._id = id;
    return this;
  }

  owner(owner: string): this {
    this.state.owner = owner;
    return this;
  }

  singleSkills(singleSkills: ISingleSkillDetailed[]): this {
    this.state.singleSkills = singleSkills;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      _id: undefined,
      owner: undefined,
      singleSkills: [
        {
          _id: '',
          target: enums.ESkillTarget.Enemy,
          name: '',
          type: enums.ESkillsType.Attack,
          power: 0,
        },
      ],
    };
  }
}
