import TemplateFactory from './abstracts';
import { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';
import { ILogBody, ILogEntity } from '../../../../src/modules/log/entity';
import Log from '../../../../src/modules/log/model';

export default class FakeLog extends TemplateFactory<EFakeData.Logs> implements IAbstractBody<ILogEntity> {
  constructor() {
    super(Log);
  }

  _id(id: string): this {
    this.state._id = id;
    return this;
  }

  logs(logs: ILogBody[]): this {
    this.state.logs = logs;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      logs: [],
    };
  }
}
