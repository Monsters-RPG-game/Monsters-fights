import Validation from '../../../tools/validation';
import type { ICreateFightDto } from './types';
import type { IFightCharacterEntity } from '../../../types/characters';
import type { IStateTeam } from '../../state/types';

export default class CreateFightDto implements ICreateFightDto {
  teams: [IStateTeam[], IStateTeam[]];
  attacker: IFightCharacterEntity;

  constructor(data: ICreateFightDto) {
    this.teams = data.teams;
    this.attacker = data.attacker;

    this.validate();
  }

  private validate(): void {
    new Validation(this.teams, 'teams').isDefined().isArray().minElements(2).maxElements(2);
    new Validation(this.attacker, 'attacker').isDefined();

    this.teams.forEach((t) => {
      new Validation(t, 'team').isArray();

      t.forEach((ch) => {
        new Validation(ch.character, 'character').isDefined();
      });
    });
    new Validation(this.teams[1], 'enemy team').isArray().minElements(1);
  }
}
