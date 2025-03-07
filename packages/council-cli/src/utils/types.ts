export type IsNever<T> = [T] extends [never] ? true : false;

export type IfElse<
  TCondition extends boolean,
  TTrue,
  TFalse,
> = TCondition extends true ? TTrue : TFalse;

/**
 * Get a union of all required keys on `T`
 */
export type RequiredKey<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

/**
 * Get a union of all options keys on `T`
 */
export type OptionalKey<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];
