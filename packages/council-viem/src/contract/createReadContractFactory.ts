import { ReadContractFactory } from "@delvtech/council-core";
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
): ReadContractFactory {
  return (instanceOptions) => {
    // const options = {
    //   ...factoryOptions,
    //   ...instanceOptions,
    // };

    // const viemReadContract = createReadContract({
    //   abi: options.abi,
    //   address: options.address,
    //   publicClient: options.publicClient,
    // });

    // const viemNetwork = createNetwork(options.publicClient);

    // Adds custom event fetching logic to the base contract before caching.
    return createCachedReadContract({
      ...factoryOptions,
      ...instanceOptions,
    });
  };
}
