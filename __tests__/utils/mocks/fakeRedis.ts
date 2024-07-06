import Redis from '../../../src/connections/redis';
import type { IFullFight } from '../../../src/modules/fights/types';
import type { ISkillsEntity } from '../../../src/modules/skills/entity';

export default class FakeRedis extends Redis {
  private _fights: IFullFight[] = [];
  private _skills: ISkillsEntity[] = [];

  get skills(): ISkillsEntity[] {
    return this._skills;
  }
  protected set skills(value: ISkillsEntity[]) {
    this._skills = value;
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

  override async addCachedSkills(skills: ISkillsEntity, _userId: string): Promise<void> {
    return new Promise((resolve) => {
      this.skills.push(skills);
      resolve();
    });
  }

  override async getSkills(target: string): Promise<ISkillsEntity | undefined> {
    return new Promise((resolve) => {
      const data = this.skills.find((f) => f.owner === target);
      resolve(data);
    });
  }

  override async updateFight(_target: string, fight: IFullFight): Promise<void> {
    return new Promise((resolve) => {
      const index = this.fights.findIndex((f) => f._id === fight._id);
      this.fights[index] = fight;
      resolve();
    });
  }

  override async getFight(target: string): Promise<IFullFight | undefined> {
    return new Promise((resolve) => {
      const data = this.fights.find((f) => f.attacker === target);
      resolve(data);
    });
  }

  override async removeFight(target: string): Promise<void> {
    return new Promise((resolve) => {
      this.fights = this.fights.filter((f) => f.attacker !== target);
      resolve();
    });
  }
}
