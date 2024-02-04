import { SimpleCache } from "@council/evm-client";
import { ViemCachedReadContract } from "@council/evm-client-viem";
import { CachedReadContractFactory } from "@delvtech/council-core";
import { PublicClient } from "viem";

export interface CreateViemReadContractFactoryOptions {
  publicClient: PublicClient;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export function createViemReadContractFactory(
  options: CreateViemReadContractFactoryOptions,
): CachedReadContractFactory {
  return (factoryOptions) => {
    return new ViemCachedReadContract({
      ...factoryOptions,
      ...options,
    });
  };
}
