import LRUCache from "lru-cache";
import { cached, cachedKey } from "src/utils/cached";
import { CouncilContext } from "src/context";
import { DataSource } from "./DataSource";

/**
 * A DataSource with methods for caching return values using an LRU cache.
 * @see https://github.com/isaacs/node-lru-cache
 * @category Data Sources
 */
export class CachedDataSource implements DataSource {
  context: CouncilContext;
  cache: LRUCache<string, any>;

  constructor(context: CouncilContext, cache?: LRUCache<string, any>) {
    this.context = context;
    this.cache = cache ?? new LRUCache({ max: 500 });
  }

  /**
   * Cache the result of a callback using a given key.
   * @param cacheKey - The key to use for the cache entry. The key will be reduced
   *   to a string.
   * @param callback - The function to be cached. The return type of the `cached`
   *   method will match the return type of this function.
   * @returns The cached result of the callback function.
   */
  cached<T extends (...args: any) => any, TKey = any>(
    cacheKey: TKey,
    callback: T,
  ): ReturnType<T> {
    return cached({
      cacheKey,
      cache: this.cache,
      callback,
    });
  }

  /**
   * Delete all entries from the cache.
   */
  clearCached(): void {
    return this.cache.clear();
  }

  /**
   * Delete a single entry from the cache.
   * @returns A boolean indicating whether the entry was successfully deleted.
   */
  deleteCached(cacheKey: string | any): boolean {
    return this.cache.delete(cachedKey(cacheKey));
  }
}
