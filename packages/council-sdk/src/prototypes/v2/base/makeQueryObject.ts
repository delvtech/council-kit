import { QueryClient, QueryObserverOptions } from "@tanstack/query-core";
import { QueryObject } from "src/prototypes/v2/base/QueryObject";

export function makeQueryObject<T>(
  queryClient: QueryClient,
  queryOptions: QueryObserverOptions<T>,
): QueryObject<T> {
  return {
    queryOptions,
    fetch: () => queryClient.fetchQuery(queryOptions),
  };
}
