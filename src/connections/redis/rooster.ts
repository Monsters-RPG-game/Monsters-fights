import type * as enums from '../../enums';
import type { RedisClientType } from 'redis';

export default class Rooster {
  private _client: RedisClientType | undefined = undefined;

  private get client(): RedisClientType {
    return this._client!;
  }

  async getFromHash(data: { target: enums.ERedisTargets | string; value: string }): Promise<string | undefined> {
    const { target, value } = data;
    const exist = await this.checkElm(target);
    if (!exist) return undefined;
    return this.client.hGet(target, value);
  }
  async setExpirationDate(target: enums.ERedisTargets | string, time: number): Promise<void> {
    await this.client.expire(target, time);
  }
  init(client: RedisClientType): void {
    this._client = client;
  }

  async addToHash(target: enums.ERedisTargets | string, key: string, value: string): Promise<void> {
    await this.client.hSet(target, key, value);
  }

  async removeFromHash(target: enums.ERedisTargets | string, value: string): Promise<void> {
    const exist = await this.checkElm(target);
    if (!exist) return;
    await this.client.hDel(target, value);
  }

  async removeElement(target: string): Promise<void> {
    await this.client.del(target);
  }

  private async checkElm(target: enums.ERedisTargets | string): Promise<boolean> {
    if (!this.client) return false;
    const e: number = await this.client.exists(target);
    return e !== 0;
  }
}
