import TemplateFactory from './abstracts';
import Fight from '../../../../src/modules/fights/model';
import type { IFightEntity } from '../../../../src/modules/fights/entity';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

export default class FakeFight
  extends TemplateFactory<EFakeData.Fights>
  implements
    IAbstractBody<
      Omit<IFightEntity, 'states'> & {
        fightStates: string;
      }
    >
{
  constructor() {
    super(Fight);
  }

  _id(id: string): this {
    this.state._id = id;
    return this;
  }

  log(log: string): this {
    this.state.log = log;
    return this;
  }

  fightStates(states: string): this {
    this.state.states = states;
    return this;
  }

  attacker(attacker: string): this {
    this.state.attacker = attacker;
    return this;
  }

  active(active: boolean): this {
    this.state.active = active;
    return this;
  }

  phase(phase: number): this {
    this.state.phase = phase;
    return this;
  }

  finish(finish: string): this {
    this.state.finish = finish;
    return this;
  }

  start(start: string): this {
    this.state.start = start;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      log: undefined,
      states: undefined,
      attacker: undefined,
      active: false,
      phase: 0,
      start: undefined,
      finish: undefined,
    };
  }
}
