import Validation from '../../../tools/validation';
import type { ICreateFightDto, IFightProfile } from './createFight.types';

export default class CreateFightDto implements ICreateFightDto {
  teams: [IFightProfile[], IFightProfile[]];
  attacker: string;

  constructor(data: ICreateFightDto) {
    this.teams = data.teams;
    this.attacker = data.attacker;

    this.validate();
  }

  private validate(): void {
    new Validation(this.teams, 'teams').isDefined().isArray().minElements(2).maxElements(2);
    new Validation(this.attacker, 'attacker').isDefined().isObjectId();

    this.teams.forEach((t) => {
      new Validation(t, 'team').isArray();

      t.forEach((ch) => {
        new Validation(ch.userId, 'userId').isDefined().isObjectId();
        new Validation(ch.userName, 'userName').isDefined().isString();
      });
    });
  }
}
