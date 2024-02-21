import {
  ReadContractFactory,
  extendReadContract,
} from "@delvtech/council-core";
import {
  SimpleCache,
  createNetwork,
  createReadContract,
} from "@delvtech/evm-client-viem";
import { Client } from "viem";

export interface CreateReadContractFactoryOptions {
  client: Client;
  cache?: SimpleCache;
  namespace?: string;
}

export function createReadContractFactory(
  factoryOptions: CreateReadContractFactoryOptions,
): ReadContractFactory {
  return (instanceOptions) => {
    const options = {
      ...factoryOptions,
      ...instanceOptions,
    };

    const viemReadContract = createReadContract({
      abi: options.abi,
      address: options.address,
      client: options.client,
    });

    const viemNetwork = createNetwork(options.client);

    // Adds custom event fetching logic to the base contract before caching.
    return extendReadContract({
      ...options,
      contract: viemReadContract,
      network: viemNetwork,
    });
  };
}
