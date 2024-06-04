import type { IFightEntity } from './entity';
import type { IFullFight } from './types';
import type { IStateEntity, IStateTeamEntity } from '../state/entity';
import type { IFightState } from '../state/types';
import type { IStatsEntity } from '../stats/entity';

/**
 * Fill additional data for dbFight in order to make fully working fight
 */
export const prepareFight = (dbFight: IFightEntity, dbState: IStateEntity, dbStats: IStatsEntity[]): IFullFight => {
  const states: IFightState = {
    _id: dbState._id,
    initialized: {
      enemy: [],
      attacker: [],
    },
    current: {
      enemy: [],
      attacker: [],
    },
  };
  const fight: IFullFight = { ...dbFight, states };

  states.current.enemy = dbState.current.enemy.map((e) => {
    const stats = dbStats.find((s) => s.character.toString() === e.character.toString())!;
    return { ...e, character: { lvl: stats.lvl, stats: stats.stats, _id: e.character } };
  });
  states.current.attacker = dbState.current.attacker.map((e) => {
    const stats = dbStats.find((s) => s.character.toString() === e.character.toString())!;
    return { ...e, character: { lvl: stats.lvl, stats: stats.stats, _id: e.character } };
  });
  states.initialized.enemy = dbState.initialized.enemy.map((e) => {
    const stats = dbStats.find((s) => s.character.toString() === e.character.toString())!;
    return { ...e, character: { lvl: stats.lvl, stats: stats.stats, _id: e.character } };
  });
  states.initialized.attacker = dbState.initialized.attacker.map((e) => {
    const stats = dbStats.find((s) => s.character.toString() === e.character.toString())!;
    return { ...e, character: { lvl: stats.lvl, stats: stats.stats, _id: e.character } };
  });

  return fight;
};

/**
 * Prepare fight data to update it in database
 */
export const prepareStatsToSave = (states: IFightState): IStateEntity => {
  return {
    ...states,
    current: {
      ...states.current,
      attacker: states.current.attacker.map((a) => {
        return { ...a, character: a.character._id } as IStateTeamEntity;
      }),
      enemy: states.current.enemy.map((a) => {
        return { ...a, character: a.character._id } as IStateTeamEntity;
      }),
    },
    initialized: {
      ...states.initialized,
      attacker: states.initialized.attacker.map((a) => {
        return { ...a, character: a.character._id } as IStateTeamEntity;
      }),
      enemy: states.initialized.enemy.map((a) => {
        return { ...a, character: a.character._id } as IStateTeamEntity;
      }),
    },
  };
};
