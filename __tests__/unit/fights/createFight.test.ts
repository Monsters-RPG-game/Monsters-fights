import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import { ICreateFightDto } from '../../../src/modules/fights/create/types';
import CreateFightDto from '../../../src/modules/fights/create/dto';
import { IStateTeam } from '../../../src/modules/state/types';

describe('Fights - create', () => {
  const data: ICreateFightDto = {
    teams: [[], [{ character: '63e55edbe8a800060911121d', hp: 10 }]],
    attacker: '63e55edbe8a800060911121e',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing page`, () => {
        const clone = structuredClone(data);
        clone.teams = undefined!;

        try {
          new CreateFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('teams'));
        }
      });

      it(`Missing attacker`, () => {
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
      it(`Teams incorrect type`, () => {
        const clone = structuredClone(data);
        clone.teams = 'bc' as unknown as [IStateTeam[], IStateTeam[]];

        try {
          new CreateFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('teams should be array'));
        }
      });

      it(`Teams missing character in team`, () => {
        const clone = structuredClone(data);
        clone.teams = [[], [{ hp: 10 }]] as unknown as [IStateTeam[], IStateTeam[]];

        try {
          new CreateFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('character'));
        }
      });

      it(`Attacker incorrect type`, () => {
        const clone = structuredClone(data);
        clone.attacker = 'asd';

        try {
          new CreateFightDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('attacker should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it(`Attack`, () => {
      const clone = structuredClone(data);

      try {
        new CreateFightDto(clone);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
