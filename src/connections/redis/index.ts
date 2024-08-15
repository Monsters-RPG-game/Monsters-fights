import { createClient } from 'redis';
import Rooster from './rooster';
import * as enums from '../../enums';
import { type IFullFight } from '../../modules/fights/types';
import getConfig from '../../tools/configLoader';
import Log from '../../tools/logger';
import type { ISkillsEntity } from '../../modules/skills/entity';
import type { IFullError } from '../../types';
import type { RedisClientType } from 'redis';

export default class Redis {
  private readonly _rooster: Rooster;
  private _client: RedisClientType | undefined;

  constructor() {
    this._rooster = new Rooster();
  }

  private get client(): RedisClientType | undefined {
    return this._client;
  }

  private get rooster(): Rooster {
    return this._rooster;
  }

  async getFight(target: string): Promise<IFullFight | undefined> {
    const data = await this.rooster.getFromHash({ target: `${enums.ERedisTargets.Fights}:${target}`, value: target });
    return data ? (JSON.parse(data) as IFullFight) : undefined;
  }
  async getSkills(target: string): Promise<ISkillsEntity | undefined> {
    const data = await this.rooster.getFromHash({
      target: `${enums.ERedisTargets.CachedSkills}:${target}`,
      value: target,
    });
    return data ? (JSON.parse(data) as ISkillsEntity) : undefined;
  }
  private async setExpirationDate(target: enums.ERedisTargets | string, ttl: number): Promise<void> {
    await this.rooster.setExpirationDate(target, ttl);
  }
  async init(): Promise<void> {
    this.initClient();
    this.rooster.init(this.client!);
    this.listen();
    await this.client!.connect();
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }

  async addFight(target: string, fight: IFullFight): Promise<void> {
    await this.rooster.addToHash(`${enums.ERedisTargets.Fights}:${target}`, target, JSON.stringify(fight));
    return this.setExpirationDate(`${enums.ERedisTargets.Fights}:${target}`, 60 * 30);
  }

  async addCachedSkills(skills: ISkillsEntity, userId: string): Promise<void> {
    await this.rooster.addToHash(`${enums.ERedisTargets.CachedSkills}:${userId}`, userId, JSON.stringify(skills));
    await this.rooster.setExpirationDate(`${enums.ERedisTargets.CachedSkills}:${userId}`, 60000);
  }

  async updateFight(target: string, fight: IFullFight): Promise<void> {
    await this.rooster.addToHash(`${enums.ERedisTargets.Fights}:${target}`, target, JSON.stringify(fight));
    return this.setExpirationDate(`${enums.ERedisTargets.Fights}:${target}`, 60 * 30);
  }

  async removeFight(target: string): Promise<void> {
    return this.rooster.removeFromHash(`${enums.ERedisTargets.Fights}:${target}`, target);
  }

  private initClient(): void {
    this._client = createClient({
      url: getConfig().redisURI,
    });
  }

  private listen(): void {
    this.client!.on('error', (err) => {
      const error = err as IFullError;
      return Log.error('Redis', error.message, error.stack);
    });

    this.client!.on('ready', () => Log.log('Redis', 'Redis connected'));
    this.client!.on('end', () => Log.log('Redis', 'Redis disconnected'));
    this.client!.on('reconnecting', () => Log.log('Redis', 'Redis error. Reconnecting'));
  }
}
