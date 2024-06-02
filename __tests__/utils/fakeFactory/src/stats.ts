import TemplateFactory from './abstracts';
import Stats from '../../../../src/modules/stats/model';
import type { IStatsEntity } from '../../../../src/modules/stats/entity';
import type { ICharacterStats } from '../../../../src/types/characters';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

export default class FakeStats extends TemplateFactory<EFakeData.Stats> implements IAbstractBody<IStatsEntity> {
  constructor() {
    super(Stats);
  }

  _id(id: string): this {
    this.state._id = id;
    return this;
  }

  character(character: string): this {
    this.state.character = character;
    return this;
  }

  lvl(lvl: number): this {
    this.state.lvl = lvl;
    return this;
  }

  stats(stats: ICharacterStats): this {
    this.state.stats = stats;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      stats: {
        intelligence: 1,
        strength: 1,
        hp: 1,
      },
      lvl: undefined,
      character: undefined,
      _id: undefined,
    };
  }
}
