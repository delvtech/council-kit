import { SimpleCache } from "@council/evm-client";
import { createViemCachedReadContract } from "@council/evm-client-viem";
import { CachedReadContractFactory } from "@delvtech/council-core";
import { PublicClient } from "viem";

export interface CreateViemReadContractFactoryOptions {
  publicClient: PublicClient;
  cache?: SimpleCache;
  namespace?: string;
}

export function createViemReadContractFactory(
  factoryOptions: CreateViemReadContractFactoryOptions,
): CachedReadContractFactory {
  return (instanceOptions) => {
    return createViemCachedReadContract({
      ...factoryOptions,
      ...instanceOptions,
    });
  };
}
