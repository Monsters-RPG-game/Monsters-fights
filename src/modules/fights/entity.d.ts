export interface IFightEntity {
  _id: string;
  log: string;
  states: string;
  attacker: string;
  active: boolean;
  phase: number;
  start: string;
  finish: string;
}
