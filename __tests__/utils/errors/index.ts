import { FullError } from '../../../src/errors';

export class MongoNotObjectIdError extends FullError {
  constructor(model: string, target: string, value: string) {
    super('MongoNotObjectIdError');
    this.message = `${model} validation failed: ${target}: Cast to ObjectId failed for value "${value}" (type string) at path "${target}" because of "BSONError"`;
    this.name = 'MongoNotObjectIdError';
    this.code = '001';
    this.status = 400;
  }
}

export class MongoMissingError extends FullError {
  constructor(model: string, target: string) {
    super('MongoMissingError');
    this.message = `${model} validation failed: ${target}: ${target} not provided`;
    this.name = 'MongoMissingError';
    this.code = '002';
    this.status = 400;
  }
}

export class MongoIncorrectEnumError extends FullError {
  constructor(model: string, target: string, value: string) {
    super('MongoIncorrectEnumError');
    this.message =
      model + ' validation failed: type: `' + value + '` is not a valid enum value for path `' + target + '`.';
    this.name = 'MongoIncorrectEnumError';
    this.code = '003';
    this.status = 400;
  }
}

export class MongoIncorrectMinLengthError extends FullError {
  constructor(model: string, target: string, length: number) {
    super('MongoIncorrectMinLengthError');
    this.message = `${model} validation failed: ${target}: Min length is ${length} characters`;
    this.name = 'MongoIncorrectMinLengthError';
    this.code = '004';
    this.status = 400;
  }
}
