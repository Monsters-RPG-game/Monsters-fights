import { EAction } from '../../../enums';
import Validation from '../../../tools/validation';
import type { ICreateActionDto } from './types';
import type mongoose from 'mongoose';

export default class CreateActionDto implements ICreateActionDto {
  character: mongoose.Types.ObjectId;
  target: mongoose.Types.ObjectId;
  action: EAction;
  value: number;

  constructor(data: ICreateActionDto) {
    this.character = data.character;
    this.action = data.action;
    this.target = data.target;
    this.value = data.value;

    this.validate();
  }

  private validate(): void {
    new Validation(this.target, 'target').isDefined().isObjectId();
    new Validation(this.character, 'character').isDefined().isObjectId();
    new Validation(this.action, 'action').isDefined().isPartOfEnum(EAction);
    new Validation(this.value, 'value').isDefined().isNumber();
  }
}
