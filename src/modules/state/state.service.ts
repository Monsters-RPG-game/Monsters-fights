import { Injectable } from '@nestjs/common';
import type CreateFightDto from '../fight/createFight/createFight.dto';
import type { ILeaveFightDto } from '../fight/leaveFight/leaveFight.types';

@Injectable()
export default class StateService {
  private _fights: CreateFightDto[] = [];

  private get fights(): CreateFightDto[] {
    return this._fights;
  }

  private set fights(value: CreateFightDto[]) {
    this._fights = value;
  }

  createFight(data: CreateFightDto): void {
    this.fights.push(data);
  }

  leaveFight(data: ILeaveFightDto): void {
    this.fights = this.fights.filter((f) => f.attacker !== data.user);
  }

  isAlreadyFighting(user: string): boolean {
    return this.fights.find((f) => f.attacker === user) !== undefined;
  }
}
