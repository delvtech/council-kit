import {
  CachedReadContract,
  CachedReadWriteContract,
  CreateCachedReadContractOptions,
  CreateCachedReadWriteContractOptions,
  Network,
  createCachedReadContract,
  createCachedReadWriteContract,
} from "@delvtech/evm-client";
import { Abi } from "abitype";
import { Prettify } from "src/types";
import { getEventsWithSplitAndRetry } from "src/utils/getEventsWithSplitAndRetry";

interface ExtendOptions {
  network: Network;
  /**
   * The maximum number of times to split a failed event query into smaller
   * block ranges and retry. This number has the potential to increase the
   * number of requests exponentially, so the number should be considered
   * carefully. Defaults to 5.
   */
  maxEventQuerySplits?: number;
}

export type ExtendReadContractOptions<TAbi extends Abi = Abi> = Prettify<
  ExtendOptions & CreateCachedReadContractOptions<TAbi>
>;

/**
 * Extends a read contract with custom event fetching logic and caching. When
 * event queries fail, the range of blocks is recursively split in half and the
 * query is retried until the `maxEventQuerySplits` is reached.
 */
export function extendReadContract<TAbi extends Abi = Abi>({
  contract,
  network,
  cache,
  namespace,
  maxEventQuerySplits = 5,
}: ExtendReadContractOptions<TAbi>): CachedReadContract<TAbi> {
  return createCachedReadContract({
    contract: {
      ...contract,
      getEvents(eventName, options) {
        return getEventsWithSplitAndRetry({
          contract,
          network,
          eventName,
          options,
          attemptsLeft: maxEventQuerySplits,
        });
      },
    },
    cache,
    namespace,
  });
}

export type ExtendReadWriteContractOptions<TAbi extends Abi = Abi> = Prettify<
  ExtendOptions & CreateCachedReadWriteContractOptions<TAbi>
>;

/**
 * Extends a read contract with custom event fetching logic and caching. When
 * event queries fail, the range of blocks is recursively split in half and the
 * query is retried until the `maxEventQuerySplits` is reached.
 */
export function extendReadWriteContract<TAbi extends Abi = Abi>({
  contract,
  network,
  cache,
  namespace,
  maxEventQuerySplits = 5,
}: ExtendReadWriteContractOptions<TAbi>): CachedReadWriteContract<TAbi> {
  return createCachedReadWriteContract({
    contract: {
      ...contract,
      getEvents(eventName, options) {
        return getEventsWithSplitAndRetry({
          contract,
          network,
          eventName,
          options,
          attemptsLeft: maxEventQuerySplits,
        });
      },
    },
    cache,
    namespace,
  });
}
