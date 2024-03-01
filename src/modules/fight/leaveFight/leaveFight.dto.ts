import Validation from '../../../tools/validation';
import type { ILeaveFightDto } from './leaveFight.types';

export default class LeaveFightDto implements ILeaveFightDto {
  user: string;

  constructor(data: ILeaveFightDto) {
    this.user = data.user;

    this.validate();
  }

  private validate(): void {
    new Validation(this.user, 'user').isDefined().isObjectId();
  }
}
