import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import AttackDto from '../../../src/modules/fights/attack/dto';
import type { IAttackDto } from '../../../src/modules/fights/attack/types';

describe('Fights - attack', () => {
  const data: IAttackDto = { target: '63e55edbe8a800060911121d' };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing target', () => {
        const clone = structuredClone(data);
        clone.target = undefined!;

        try {
          new AttackDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('target'));
        }
      });
    });

    describe('Incorrect data', () => {
      it('Target incorrect type', () => {
        const clone = structuredClone(data);
        clone.target = 'bc';

        try {
          new AttackDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('target should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Attack', () => {
      const clone = structuredClone(data);

      try {
        new AttackDto(clone);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
