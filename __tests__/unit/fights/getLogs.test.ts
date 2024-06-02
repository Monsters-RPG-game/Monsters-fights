import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import GetLogsDto from '../../../src/modules/fights/getLogs/dto';
import type { IGetLogsDto } from '../../../src/modules/fights/getLogs/types';

describe('Fights - get logs', () => {
  const data: IGetLogsDto = {
    id: '63e55edbe8a800060911121e',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing id', () => {
        const clone = structuredClone(data);
        clone.id = undefined!;

        try {
          new GetLogsDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('id'));
        }
      });
    });

    describe('Incorrect data', () => {
      it('Id incorrect type', () => {
        const clone = structuredClone(data);
        clone.id = 'bc';

        try {
          new GetLogsDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('id should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Get logs', () => {
      const clone = structuredClone(data);

      try {
        new GetLogsDto(clone);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
