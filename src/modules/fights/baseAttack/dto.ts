import Validation from '../../../tools/validation';
import type { IBaseAttackDto } from './types';

export default class BaseAttackDto implements IBaseAttackDto {
  target: string;
  externalPower: number;

  constructor(data: IBaseAttackDto) {
    this.target = data.target!;
    this.externalPower = data.externalPower ?? 1;

    this.validate();
  }

  private validate(): void {
    new Validation(this.target, 'target').isDefined().isObjectId();
    if (this.externalPower) {
      new Validation(this.externalPower, 'externalPower').isDefined().isNumber();
    }
  }
}
