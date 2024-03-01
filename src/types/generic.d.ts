export type TypesOfClass<T> = { [K in keyof T]: T[K] };
