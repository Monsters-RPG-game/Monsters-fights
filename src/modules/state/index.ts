import type { IFullFight } from '../fights/types';

export default class State {
  private _fights: IFullFight[] = [];
  private _cleaner: Record<string, NodeJS.Timeout> = {};

  private get fights(): IFullFight[] {
    return this._fights;
  }

  private set fights(value: IFullFight[]) {
    this._fights = value;
  }

  private get cleaner(): Record<string, NodeJS.Timeout> {
    return this._cleaner;
  }

  create(data: IFullFight): void {
    this.fights.push(data);

    this.cleaner[data.attacker.toString()] = setTimeout(() => {
      this.leave(data.attacker.toString());
    }, 20 * 60000);
  }

  leave(user: string): void {
    this.fights = this.fights.filter((f) => f.attacker.toString() !== user);
  }

  get(user: string): IFullFight | undefined {
    return this.fights.find((f) => f.attacker.toString() === user);
  }
}
