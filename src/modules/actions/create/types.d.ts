import type { EAction } from '../../../enums';

export interface ICreateActionDto {
  character: string;
  action: EAction;
  target: string;
  value: number;
}
