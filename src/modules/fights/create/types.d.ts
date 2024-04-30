import type { IFightCharacterEntity } from '../../../types/characters';
import type { IStateTeam } from '../../state/types';

export interface ICreateFightDto {
  teams: [IStateTeam[], IStateTeam[]];
  attacker: IFightCharacterEntity;
}
