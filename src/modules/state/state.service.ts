import { Injectable } from '@nestjs/common';
import type CreateFightDto from '../fight/createFight/createFight.dto';
import type { ILeaveFightDto } from '../fight/leaveFight/leaveFight.types';

@Injectable()
export default class StateService {
  private _fights: CreateFightDto[] = [];
  private _cleaner: Record<string, NodeJS.Timeout> = {};

  private get cleaner(): Record<string, NodeJS.Timeout> {
    return this._cleaner;
  }

  private get fights(): CreateFightDto[] {
    return this._fights;
  }

  private set fights(value: CreateFightDto[]) {
    this._fights = value;
  }

  createFight(data: CreateFightDto): void {
    this.fights.push(data);

    this.cleaner[data.attacker] = setTimeout(() => {
      this.leaveFight({ user: data.attacker });
    }, 20 * 60000);
  }

  leaveFight(data: ILeaveFightDto): void {
    this.fights = this.fights.filter((f) => f.attacker !== data.user);
  }

  get(user: string): CreateFightDto | undefined {
    return this.fights.find((f) => f.attacker === user);
  }
}
