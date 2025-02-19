import { ClientCache, MaybePromise, SerializableKey } from "@delvtech/drift";

/**
 * Checks the cache for the key and returns the value if found, otherwise
 * executes the function and stores the result in the cache before returning it.
 */
export async function cachedFn<
  T extends (...args: any[]) => MaybePromise<any>,
>({
  cache,
  key,
  fn,
}: {
  cache: ClientCache;
  key: MaybePromise<SerializableKey>;
  fn: T;
}): Promise<T> {
  key = await key;
  if (await cache.has(key)) {
    return cache.get(key) as any;
  }
  return fn().then((value: unknown) =>
    value === undefined ? value : cache.set(key, value).then(() => value),
  );
}
