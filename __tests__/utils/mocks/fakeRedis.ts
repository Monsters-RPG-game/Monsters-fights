import Redis from '../../../src/connections/redis';
import type { IFullFight } from '../../../src/modules/fights/types';

export default class FakeRedis extends Redis {
  private _fights: IFullFight[] = [];

  constructor() {
    super();
  }

  get fights(): IFullFight[] {
    return this._fights;
  }

  protected set fights(value: IFullFight[]) {
    this._fights = value;
  }

  override async addFight(_target: string, fight: IFullFight): Promise<void> {
    return new Promise((resolve) => {
      this.fights.push(fight);
      resolve();
    });
  }

  override async updateFight(_target: string, fight: IFullFight): Promise<void> {
    return new Promise((resolve) => {
      const index = this.fights.findIndex(f => f._id === fight._id);
      this.fights[index] = fight;
      resolve();
    });
  }

  override async getFight(target: string): Promise<IFullFight | undefined> {
    return new Promise((resolve) => {
      const data = this.fights.find(f => f.attacker === target);
      resolve(data);
    });
  }

  override async removeFight(target: string): Promise<void> {
    return new Promise((resolve) => {
      this.fights = this.fights.filter(f => f.attacker !== target);
      resolve();
    });
  }
}
