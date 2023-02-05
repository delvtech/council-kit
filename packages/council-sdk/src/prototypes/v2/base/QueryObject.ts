import { QueryObserverOptions } from "@tanstack/query-core";

export type QueryObject<T> = {
  queryOptions: QueryObserverOptions<T>;
  fetch: () => Promise<T>;
};
