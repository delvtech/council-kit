import LRUCache from "lru-cache";
import { cached, cachedKey } from "src/utils/cached";
import { CouncilContext } from "src/context";
import { DataSource } from "./DataSource";

export class CachedDataSource implements DataSource {
  context: CouncilContext;
  cache: LRUCache<string, any>;

  constructor(context: CouncilContext, cache?: LRUCache<string, any>) {
    this.context = context;
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
   * @returns A boolean indicating the entry was successfully deleted
   */
  deleteCached(cacheKey?: string | any): boolean {
    return this.cache.delete(cachedKey(cacheKey));
  }
}
