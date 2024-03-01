import Validation from '../../../tools/validation';
import type { IAttackDto } from './attack.types';

export default class AttackDto implements IAttackDto {
  target: string;

  constructor(data: IAttackDto) {
    this.target = data.target;

    this.validate();
  }

  private validate(): void {
    new Validation(this.target, 'target').isDefined().isObjectId();
  }
}
