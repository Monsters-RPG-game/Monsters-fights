import Validation from '../../../tools/validation';
import type { IGetFightDto } from './types';

export default class GetFightDto implements IGetFightDto {
  owner: string;
  active: boolean;
  page: number;

  constructor(data: IGetFightDto) {
    this.owner = data.owner;
    this.active = data.active;
    this.page = data.page ?? 1;

    this.validate();
  }

  private validate(): void {
    new Validation(this.owner, 'owner').isDefined().isObjectId();
    new Validation(this.active, 'active').isDefined().isBoolean();
    if (!this.active) {
      new Validation(this.page, 'page').isDefined().isNumber().isBetween(100, 1);
    }
  }
}
