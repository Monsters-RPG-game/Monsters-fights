import mongoose from 'mongoose';
import * as errors from '../../errors';

export default class Validation {
  private readonly _v: unknown;
  private readonly _name: string;

  constructor(v: unknown, name: string) {
    this._v = v;
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get v(): unknown {
    return this._v;
  }

  /**
   * Validate if element is typeof string
   * Require param: any
   */
  isDefined(): this {
    const { v, name } = this;
    if (v === undefined || v === null) throw new errors.MissingArgError(name);

    return this;
  }

  /**
   * Validate if element is typeof string
   * Require param: any
   */
  isString(): this {
    const { v, name } = this;
    if (typeof v !== 'string') {
      throw new errors.IncorrectArgTypeError(`${name} should be a string`);
    }

    return this;
  }

  /**
   * Validate if element is typeof number
   * Require param: any
   */
  isNumber(): this {
    const { v, name } = this;
    if (typeof v !== 'number') throw new errors.IncorrectArgTypeError(`${name} should be number`);

    return this;
  }

  /**
   * Validate if element is typeof mongoose.ObjectId
   * Require param: string
   */
  isObjectId(): this {
    const { v, name } = this;
    const value = v as string;

    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new errors.IncorrectArgTypeError(`${name} should be objectId`);
    }

    return this;
  }

  /**
   * Validate if element is typeof array
   * Require param: array of strings
   */
  isArray(): this {
    const { v, name } = this;
    const value = v as string;

    if (!Array.isArray(value)) throw new errors.IncorrectArgTypeError(`${name} should be array`);

    return this;
  }

  /**
   * Validate if element has children, which are typeof string
   * Require param: array of strings
   */
  isStringArray(): this {
    const { v, name } = this;
    const value = v as string[];

    if (!Array.isArray(value)) throw new errors.IncorrectArgTypeError(`${name} should be array`);
    if (value.length === 0) return this;

    value.forEach((e) => {
      if (typeof e !== 'string') throw new errors.IncorrectArgTypeError(`${name}' elements are not typeof string`);
    });

    return this;
  }

  /**
   * Validate if element has children, which are typeof number
   * Require param: array of numbers
   */
  isNumberArray(): this {
    const { v, name } = this;
    const value = v as number[];

    if (!Array.isArray(value)) throw new errors.IncorrectArgTypeError(`${name} should be array`);
    if (value.length === 0) return this;

    value.forEach((e) => {
      if (typeof e !== 'number') throw new errors.IncorrectArgTypeError(`${name}' elements are not typeof number`);
    });

    return this;
  }

  /**
   * Validate if element has children, which are typeof objectId
   * Require param: array of numbers
   */
  isObjectIdArray(): this {
    const { v, name } = this;
    const value = v as string[];

    if (!Array.isArray(value)) throw new errors.IncorrectArgTypeError(`${name} should be array`);
    if (value.length === 0) return this;

    value.forEach((e) => {
      if (mongoose.Types.ObjectId.isValid(e)) throw new errors.IncorrectArgTypeError(`${name} should be objectId`);
    });

    return this;
  }

  /**
   * Validate if element's length is smaller than x and bigger than y
   * Require param: string
   */
  hasLength(max: number, min?: number): this {
    const { v, name } = this;
    const value = v as string;

    if (min) {
      if (value.length < min || value.length > max) throw new errors.IncorrectArgLengthError(name, min, max);
    } else {
      if (value.length > max) throw new errors.IncorrectArgLengthError(name, min, max);
    }

    return this;
  }

  /**
   * Validate if element is smaller than x and bigger than y
   * Require param: number
   */
  isBetween(max: number, min?: number): this {
    const { v, name } = this;
    const value = v as number;

    if (min) {
      if (value < min || value > max) throw new errors.IncorrectArgLengthError(name, min, max);
    } else {
      if (value > max) throw new errors.IncorrectArgLengthError(name, min, max);
    }

    return this;
  }

  /**
   * Validate if element is inside enum
   * Require param: any
   */
  isPartOfEnum(enumTarget: Record<string, string>): this {
    const { v, name } = this;
    const value = v as string;
    const keys = Object.values(enumTarget);

    if (!keys.includes(value)) throw new errors.IncorrectArgTypeError(`${name} has incorrect type`);

    return this;
  }

  /**
   * Validate if element is compatible with regex
   * Require param: any
   */
  isRegexCompatible(regex: RegExp, error: string): this {
    const { v } = this;
    const value = v as string;

    if (!regex.test(value)) throw new errors.IncorrectArgTypeError(error);

    return this;
  }

  /**
   * Validate if element has more children than x
   * Require param: array of strings
   */
  minElements(amount: number): this {
    const { v, name } = this;
    const value = v as string;

    if (value.length < amount) throw new errors.ElementTooShortError(name, amount);

    return this;
  }

  /**
   * Validate if element has fewer children than x
   * Require param: array of strings
   */
  maxElements(amount: number): this {
    const { v, name } = this;
    const value = v as string;

    if (value.length > amount) throw new errors.ElementTooLongError(name, amount);

    return this;
  }
}
