/**
 * Get a new type that is the same as `T` but with all bigints converted to
 * strings
 */
export type ConvertedBigInts<T> = T extends bigint
  ? string
  : T extends Array<infer U>
  ? ConvertedBigInts<U>[]
  : T extends object
  ? {
      [K in keyof T]: ConvertedBigInts<T[K]>;
    }
  : T;

/**
 * Convert bigints from an object, array, or primitive to strings
 * @param obj - The object to convert
 * @returns The object with bigints converted to strings
 */
export function stringifyBigInts<T>(obj: T): ConvertedBigInts<T> {
  if (!obj) {
    return obj as ConvertedBigInts<T>;
  }

  if (typeof obj === "bigint") {
    return obj.toString() as ConvertedBigInts<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => stringifyBigInts(item)) as ConvertedBigInts<T>;
  }

  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        stringifyBigInts(value as any),
      ]),
    ) as ConvertedBigInts<T>;
  }

  return obj as ConvertedBigInts<T>;
}
