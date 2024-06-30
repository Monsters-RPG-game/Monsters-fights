// eslint-disable-next-line max-classes-per-file
export class FullError extends Error {
  code = '000';
  status = 500;
}

export class MissingProcessPlatformError extends FullError {
  constructor() {
    super('MissingProcessPlatformError');
    this.message = 'process.platform is missing';
    this.name = 'MissingProcessPlatformError';
    this.code = '001';
    this.status = 500;
  }
}

export class NotConnectedError extends FullError {
  constructor() {
    super('NotConnectedError');
    this.message = 'Rabbit is not connected';
    this.name = 'NotConnectedError';
    this.code = '011';
    this.status = 500;
  }
}

export class IncorrectTargetError extends FullError {
  constructor() {
    super('IncorrectTargetError');
    this.message = 'Incorrect data target';
    this.name = 'IncorrectTargetError';
    this.code = '010';
    this.status = 400;
  }
}

export class MissingArgError extends FullError {
  constructor(param: string) {
    super('MissingArgError');
    this.message = `Missing param: ${param}`;
    this.name = 'MissingArgError';
    this.code = '002';
    this.status = 400;
  }
}

export class IncorrectArgError extends FullError {
  constructor(err: string) {
    super('IncorrectArgError');
    this.message = err;
    this.name = 'IncorrectArgError';
    this.code = '003';
    this.status = 400;
  }
}

export class IncorrectArgTypeError extends FullError {
  constructor(err: string) {
    super('IncorrectArgTypeError');
    this.message = err;
    this.name = 'IncorrectArgTypeError';
    this.code = '004';
    this.status = 400;
  }
}

export class IncorrectArgLengthError extends FullError {
  constructor(target: string, min: number | undefined, max: number) {
    super('IncorrectArgLengthError');
    this.message =
      min === undefined
        ? `${target} should be less than ${max} characters`
        : min !== max
          ? `${target} should be more than ${min} and less than ${max} characters`
          : `${target} should be ${min} characters`;
    this.name = 'IncorrectArgLengthError';
    this.code = '009';
    this.status = 400;
  }
}

export class ElementTooShortError extends FullError {
  constructor(target: string, min: number) {
    super('ElementTooShortError');
    this.message = `Element ${target} is too short. Minimum length is ${min}`;
    this.name = 'ElementTooShortError';
    this.code = '021';
    this.status = 400;
  }
}

export class ElementTooLongError extends FullError {
  constructor(target: string, min: number) {
    super('ElementTooShortLongError');
    this.message = `Element ${target} is too long. Maximum length is ${min}`;
    this.name = 'ElementTooShortLongError';
    this.code = '022';
    this.status = 400;
  }
}

export class UserAlreadyInFight extends FullError {
  constructor() {
    super('UserAlreadyInFight');
    this.message = 'User is already in fight';
    this.name = 'UserAlreadyInFight';
    this.code = '023';
    this.status = 400;
  }
}

export class UserNotInFight extends FullError {
  constructor() {
    super('UserNotInFight');
    this.message = 'User is not fighting';
    this.name = 'UserNotInFight';
    this.code = '024';
    this.status = 400;
  }
}

export class IncorrectAttackTarget extends FullError {
  constructor() {
    super('IncorrectAttackTarget');
    this.message = 'No enemy with provided name';
    this.name = 'IncorrectAttackTarget';
    this.code = '025';
    this.status = 400;
  }
}

export class SkillsNotFound extends FullError {
  constructor() {
    super('SkillsNotFound');
    this.message = 'No skills with provided id';
    this.name = 'SkillsNotFound';
    this.code = '026';
    this.status = 404;
  }
}
