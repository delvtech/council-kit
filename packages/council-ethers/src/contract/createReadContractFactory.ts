import {
  ReadContractFactory,
  extendReadContract,
} from "@delvtech/council-core";
import {
  SimpleCache,
  createNetwork,
  createReadContract,
} from "@delvtech/evm-client-ethers";
import { Provider } from "ethers";

export interface CreateReadContractFactoryOptions {
  provider: Provider;
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
      provider: options.provider,
    });

    const viemNetwork = createNetwork(options.provider);

    // Adds custom event fetching logic to the base contract before caching.
    return extendReadContract({
      ...options,
      contract: viemReadContract,
      network: viemNetwork,
    });
  };
}
