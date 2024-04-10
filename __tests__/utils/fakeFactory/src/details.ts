import TemplateFactory from './abstracts';
import type { EFakeData } from '../enums';
import Details from '../../../../src/modules/messagesDetails/model';
import type { IAbstractBody } from '../types/data';
import { IMessageDetailsEntity } from '../../../../src/modules/messagesDetails/entity';

export default class FakeDetails
  extends TemplateFactory<EFakeData.MessageDetails>
  implements IAbstractBody<IMessageDetailsEntity>
{
  constructor() {
    super(Details);
  }

  _id(id?: string): this {
    this.state._id = id;
    return this;
  }

  message(message?: string): this {
    this.state.message = message;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      _id: undefined,
      message: undefined,
    };
  }
}
