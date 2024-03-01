import { Injectable } from '@nestjs/common';
import type { IFullFight } from '../fight/fight.types';
import type { ILeaveFightDto } from '../fight/leaveFight/leaveFight.types';

@Injectable()
export default class StateService {
  private _fights: IFullFight[] = [];
  private _cleaner: Record<string, NodeJS.Timeout> = {};

  private get cleaner(): Record<string, NodeJS.Timeout> {
    return this._cleaner;
  }

  private get fights(): IFullFight[] {
    return this._fights;
  }

  private set fights(value: IFullFight[]) {
    this._fights = value;
  }

  createFight(data: IFullFight): void {
    this.fights.push(data);

    this.cleaner[data.attacker.toString()] = setTimeout(() => {
      this.leaveFight({ user: data.attacker.toString() });
    }, 20 * 60000);
  }

  leaveFight(data: ILeaveFightDto): void {
    this.fights = this.fights.filter((f) => f.attacker.toString() !== data.user);
  }

  get(user: string): IFullFight | undefined {
    return this.fights.find((f) => f.attacker.toString() === user);
  }
}
