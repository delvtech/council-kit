import LRUCache from "lru-cache";
import { cached, cachedKey } from "src/utils/cached";
import { DataSource } from "./DataSource";

// TODO: Add a clear entry method
export class CachedDataSource implements DataSource {
  cache: LRUCache<string, any>;

  constructor(cache?: LRUCache<string, any>) {
    this.cache = cache ?? new LRUCache({ max: 500 });
  }

  // The return type will match the return type of the callback function.
  cached<T extends (...args: any) => any, TKey = any>(
    // The cache key will be reduced to a string
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
   * @returns A boolean returned indicating the entry was successfully deleted
   */
  deleteCached(cacheKey?: string | any): boolean {
    return this.cache.delete(cachedKey(cacheKey));
  }
}
