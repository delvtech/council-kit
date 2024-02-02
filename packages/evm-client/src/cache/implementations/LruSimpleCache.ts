import stringify from "fast-json-stable-stringify";
import { LRUCache } from "lru-cache";
import { SimpleCache, SimpleCacheKey } from "src/cache/types/SimpleCache";

/**
 * An LRU (Least Recently Used) implementation of the `SimpleCache` interface.
 * This class wraps around the
 * [lru-cache](https://www.npmjs.com/package/lru-cache) library to provide LRU
 * caching capabilities conforming to the `SimpleCache` interface.
 *
 * @template TValue - The type of value to be stored in the cache.
 * @template TKey - The type of key used to access values in the cache.
 * @hidden
 */
export class LruSimpleCache<
  TValue extends NonNullable<unknown> = NonNullable<unknown>,
  TKey extends SimpleCacheKey = SimpleCacheKey,
> implements SimpleCache<TValue, TKey>
{
  protected cache: LRUCache<string, TValue, void>;

  /**
   * Initializes a new instance of the LruSimpleCache with specified options.
   *
   * @param options - Configuration options for the underlying LRUCache.
   */
  constructor(options: LRUCache.Options<string, TValue, void>) {
    this.cache = new LRUCache(options);
  }

  get(key: TKey): TValue | undefined {
    return this.cache.get(stringify(key));
  }

  set(key: TKey, value: TValue): void {
    this.cache.set(stringify(key), value);
  }

  delete(key: TKey): boolean {
    return this.cache.delete(stringify(key));
  }

  clear(): void {
    this.cache.clear();
  }

  find(predicate: (value: TValue, key: TKey) => boolean): TValue | undefined {
    return this.cache.find((value, key) => predicate(value, JSON.parse(key)));
  }
}
