export type IObjectUpdate<T, K extends keyof T> = {
  [key in K]?: T[key];
};

export type TypesOfClass<T> = { [K in keyof T]: T[K] };
