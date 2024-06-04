import TemplateFactory from './abstracts';
import Log from '../../../../src/modules/log/model';
import type { ILogBody, ILogEntity } from '../../../../src/modules/log/entity';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

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
