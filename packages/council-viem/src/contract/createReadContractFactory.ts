import { CachedReadContractFactory } from "@delvtech/council-core";
import { PublicClient } from "viem";
import { SimpleCache, createCachedReadContract } from '@council/evm-client-viem'

export interface CreateReadContractFactoryOptions {
  publicClient: PublicClient;
  cache?: SimpleCache;
  namespace?: string;
}

export function createReadContractFactory(
  factoryOptions: CreateReadContractFactoryOptions,
): CachedReadContractFactory {
  return (instanceOptions) => {
    return createCachedReadContract({
      ...factoryOptions,
      ...instanceOptions,
    });
  };
}
