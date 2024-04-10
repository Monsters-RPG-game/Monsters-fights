import StateModel from './model';
import Rooster from './rooster';
import ControllerFactory from '../../tools/abstract/controller';
import type { ICreateStateDto } from './create/types';
import type { IStateEntity } from './entity';
import type { EModules } from '../../enums';
import type { ILeaveFightDto } from '../fights/leaveFight/types';
import type { IFullFight } from '../fights/types';

export default class State extends ControllerFactory<EModules.States> {
  constructor() {
    super(new Rooster(StateModel));
  }

  private _fights: IFullFight[] = [];

  private get fights(): IFullFight[] {
    return this._fights;
  }

  private set fights(value: IFullFight[]) {
    this._fights = value;
  }

  private _cleaner: Record<string, NodeJS.Timeout> = {};

  private get cleaner(): Record<string, NodeJS.Timeout> {
    return this._cleaner;
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

  getFromDb(id: string): Promise<IStateEntity | null> {
    return this.rooster.get(id);
  }

  getManyFromDb(id: string[]): Promise<IStateEntity[]> {
    return this.rooster.getMany(id);
  }

  update(id: string, data: Partial<IStateEntity>): Promise<void> {
    return this.rooster.update(id, data);
  }

  add(data: ICreateStateDto): Promise<string> {
    return this.rooster.add(data);
  }
}
