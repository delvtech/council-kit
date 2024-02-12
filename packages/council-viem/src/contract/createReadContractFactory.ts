import { CachedReadContractFactory } from "@delvtech/council-core";
import {
  SimpleCache,
  createCachedReadContract,
} from "@delvtech/evm-client-viem";
import { PublicClient } from "viem";

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
