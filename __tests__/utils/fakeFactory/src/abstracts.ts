import type { EFakeData } from '../enums';
import type { IFakeModel, IFakeState } from '../types/data';
import type mongoose from 'mongoose';

export default abstract class TemplateFactory<T extends EFakeData> {
  private readonly _target: IFakeModel[T];
  private _state: IFakeState[T] = {};
  private _states: IFakeState[T][] = [];

  protected constructor(target: IFakeModel[T]) {
    this._target = target;
    this.fillState();
  }

  protected get target(): IFakeModel[T] {
    return this._target;
  }

  protected get state(): IFakeState[T] {
    return this._state;
  }

  protected set state(value: IFakeState[T]) {
    this._state = value;
  }

  protected get states(): IFakeState[T][] {
    return this._states;
  }

  protected set states(value: IFakeState[T][]) {
    this._states = value;
  }

  async create(): Promise<string> {
    const newElm = new this.target(this.state);
    const { _id } = await newElm.save();
    this.states.push({ ...this.state, _id });
    this.clean();
    return _id.toString();
  }

  async cleanUp(): Promise<void> {
    await Promise.all(
      Object.values(this.states).map(async (k) => {
        return (this._target as mongoose.Model<unknown>).findOneAndDelete({ _id: k._id! });
      }),
    );
    this.states = [];
  }

  protected fillState(): void {
    // abstract
  }

  private clean(): void {
    Object.entries(this.state).forEach((e) => {
      // if (typeof e[1] === 'number') e[1] = 0;
      if (typeof e[1] === 'string') e[1] = '';
      if (typeof e[1] === 'boolean') e[1] = false;
    });
  }
}
