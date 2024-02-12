import { CachedReadContractFactory } from "@delvtech/council-core";
import {
  SimpleCache,
  createCachedReadContract,
} from "@delvtech/evm-client-ethers";
import { Provider } from "ethers";

export interface CreateReadContractFactoryOptions {
  provider: Provider;
  cache?: SimpleCache;
  namespace?: string;
}

export function createReadContractFactory(
  options: CreateReadContractFactoryOptions,
): CachedReadContractFactory {
  return (factoryOptions) => {
    return createCachedReadContract({
      ...options,
      ...factoryOptions,
    });
  };
}
