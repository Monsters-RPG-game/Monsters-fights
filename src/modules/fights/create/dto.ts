import Validation from '../../../tools/validation';
import type { ICreateFightDto } from './types';
import type { IFightCharacterEntity } from '../../../types/characters';
import type { ISkillsEntity } from '../../skills/entity';
import type { IStateTeam } from '../../state/types';

export default class CreateFightDto implements ICreateFightDto {
  teams: [IStateTeam[], IStateTeam[]];
  attacker: IFightCharacterEntity;
  skills: ISkillsEntity;

  constructor(data: ICreateFightDto) {
    this.teams = data.teams;
    this.attacker = data.attacker;
    this.skills = data.skills;
    this.validate();
  }

  private validate(): void {
    new Validation(this.teams, 'teams').isDefined().isArray().minElements(2).maxElements(2);
    new Validation(this.attacker, 'attacker').isDefined();
    new Validation(this.skills, 'skills').isDefined();

    this.teams.forEach((t) => {
      new Validation(t, 'team').isArray();

      t.forEach((ch) => {
        new Validation(ch.character, 'character').isDefined();
      });
    });
    new Validation(this.teams[1], 'enemy team').isArray().minElements(1);
  }
}
