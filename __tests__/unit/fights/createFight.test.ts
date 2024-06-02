import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import CreateFightDto from '../../../src/modules/fights/create/dto';
import fakeData from '../../utils/fakeData.json';
import type { ICreateFightDto } from '../../../src/modules/fights/create/types';
import type { IFightEntity } from '../../../src/modules/fights/entity';
import type { IStateTeam } from '../../../src/modules/state/types';
import type { IStatsEntity } from '../../../src/modules/stats/entity';
import type { IFightCharacterEntity } from '../../../src/types/characters';

describe('Fights - create', () => {
  const fakeFight = fakeData.fights[0] as IFightEntity;
  const fakeStats = fakeData.stats[0] as IStatsEntity;
  const fightCharacter: IFightCharacterEntity = {
    _id: fakeFight.attacker,
    lvl: fakeStats.lvl,
    stats: fakeStats.stats,
  };
  const data: ICreateFightDto = {
    teams: [[], [{ character: fightCharacter, stats: fakeStats._id }]],
    attacker: fightCharacter,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing page', () => {
        const clone = structuredClone(data);
        clone.teams = undefined!;

        try {
          new CreateFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('teams'));
        }
      });

      it('Missing attacker', () => {
        const clone = structuredClone(data);
        clone.attacker = undefined!;

        try {
          new CreateFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('attacker'));
        }
      });
    });

    describe('Incorrect data', () => {
      it('Teams incorrect type', () => {
        const clone = structuredClone(data);
        clone.teams = 'bc' as unknown as [IStateTeam[], IStateTeam[]];

        try {
          new CreateFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('teams should be array'));
        }
      });

      it('Teams missing character in team', () => {
        const clone = structuredClone(data);
        clone.teams = [[], [{ hp: 10 }]] as unknown as [IStateTeam[], IStateTeam[]];

        try {
          new CreateFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('character'));
        }
      });

      it('Attacker incorrect type', () => {
        const clone = structuredClone(data);
        clone.attacker = 'asd' as unknown as IFightCharacterEntity;

        try {
          new CreateFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('attacker should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Attack', () => {
      const clone = structuredClone(data);

      try {
        new CreateFightDto(clone);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
