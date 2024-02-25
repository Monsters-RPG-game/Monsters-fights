import type { IStateTeam } from '../../state/state.types';

export interface ICreateFightDto {
  teams: [IStateTeam[], IStateTeam[]];
  attacker: string;
}
