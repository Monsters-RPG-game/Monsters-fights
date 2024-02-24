import type { EAction } from '../../enums';

export interface IActionEntity {
  _id: string;
  character: string;
  action: EAction;
  target: string;
  value: number;
  date: number;
}
