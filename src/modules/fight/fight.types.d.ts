import type { IFightEntity } from './fight.entity';
import type { IStateEntity } from '../state/log.entity';

export interface IFullFight extends IFightEntity {
  states: IStateEntity;
}
