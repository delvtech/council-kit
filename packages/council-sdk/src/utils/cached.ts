import LRUCache from "lru-cache";
import stringify from "fast-json-stable-stringify";

export type GetAndSetOptions = Parameters<LRUCache<string, any>["get"]>[1] &
  Parameters<LRUCache<string, any>["set"]>[2];

/**
 * A utility for wrapping a callback with caching logic.
 * @param options
 * @param options.cacheKey - The value to stringify and use to identify the cached
 *   result.
 * @param options.callback - A function with a return value that will be cached
 *   and reused based on the cache's options.
 * @param options.cache - An optional `lru-cache` instance to use for the
 *   callback's result. A new instance with `max: 500` is created by default.
 * @param options.options - LRUCache's `get` and `set` options merged.
 * @returns The return value of the callback function.
 * @see https://github.com/isaacs/node-lru-cache
 * @category Utils
 */
export function cached<TCallback extends (...args: any[]) => any>({
  cache = new LRUCache({ max: 500 }),
  cacheKey,
  callback,
  options,
}: {
  cacheKey: any;
  callback: TCallback;
  cache?: LRUCache<string, any>;
  options?: GetAndSetOptions;
}): ReturnType<TCallback> {
  const key = cachedKey(cacheKey);
  if (cache.has(key)) {
    // console.log("✅ cache hit", key);
    return cache.get(key, options) as ReturnType<TCallback>;
  } else {
    // console.log("❌ cache miss", key);
    const value = callback();
    cache.set(key, value, options);
    return value;
  }
}

/**
 * Returns a key stringified in the same way as the `cached` utility.
 * This will not modify strings so
 * `cachedKey('foo') === cachedKey(cachedKey('foo'))`.
 * @param cacheKey - The value to stringify.
 * @category Utils
 */
export function cachedKey(cacheKey: string | any): string {
  if (typeof cacheKey === "string") {
    return cacheKey;
  }
  return stringify(cacheKey);
}
