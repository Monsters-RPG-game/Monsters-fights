import Validation from '../../../tools/validation';
import type { IGetLogsDto } from './getLogs.types';

export default class GetLogsDto implements IGetLogsDto {
  id: string;

  constructor(data: IGetLogsDto) {
    this.id = data.id;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isObjectId();
  }
}
