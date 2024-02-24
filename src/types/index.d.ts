export * from './state';
export * from './connection';
export * from './user';
export * from './error';

export interface IExtends<T> {
  [key: string]: T[keyof T];
}
