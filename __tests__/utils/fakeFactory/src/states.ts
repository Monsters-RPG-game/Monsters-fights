import TemplateFactory from './abstracts';
import State from '../../../../src/modules/state/model';
import type { IStateBodyTeamEntity, IStateEntity } from '../../../../src/modules/state/entity';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

export default class FakeState extends TemplateFactory<EFakeData.States> implements IAbstractBody<IStateEntity> {
  constructor() {
    super(State);
  }

  _id(id: string): this {
    this.state._id = id;
    return this;
  }

  initialized(initialized: IStateBodyTeamEntity): this {
    this.state.initialized = initialized;
    return this;
  }

  current(current: IStateBodyTeamEntity): this {
    this.state.current = current;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      initialized: { attacker: [], enemy: [] },
      current: { attacker: [], enemy: [] },
    };
  }
}
