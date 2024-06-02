import TemplateFactory from './abstracts';
import { type EAction } from '../../../../src/enums';
import Action from '../../../../src/modules/actions/model';
import type { IActionEntity } from '../../../../src/modules/actions/entity';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

export default class FakeAction
  extends TemplateFactory<EFakeData.Actions>
  implements IAbstractBody<Omit<IActionEntity, 'target'> & { actionTarget: string }>
{
  constructor() {
    super(Action);
  }

  _id(id: string): this {
    this.state._id = id;
    return this;
  }

  character(character: string): this {
    this.state.character = character;
    return this;
  }

  action(action: EAction): this {
    this.state.action = action;
    return this;
  }

  actionTarget(target: string): this {
    this.state.target = target;
    return this;
  }

  value(value: number): this {
    this.state.value = value;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      character: undefined,
      action: undefined,
      target: undefined,
      value: undefined,
    };
  }
}
