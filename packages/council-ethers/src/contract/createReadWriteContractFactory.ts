import {
  ReadWriteContractFactory,
  extendReadWriteContract,
} from "@delvtech/council-core";
import {
  createNetwork,
  createReadWriteContract,
} from "@delvtech/evm-client-ethers";
import { Signer } from "ethers";
import { CreateReadContractFactoryOptions } from "src/contract/createReadContractFactory";

export interface CreateReadWriteContractFactoryOptions
  extends CreateReadContractFactoryOptions {
  signer: Signer;
}

export function createReadWriteContractFactory(
  factoryOptions: CreateReadWriteContractFactoryOptions,
): ReadWriteContractFactory {
  return (instanceOptions) => {
    const options = {
      ...factoryOptions,
      ...instanceOptions,
    };

    const viemReadWriteContract = createReadWriteContract({
      abi: options.abi,
      address: options.address,
      provider: options.provider,
      signer: options.signer,
    });

    const viemNetwork = createNetwork(options.provider);

    // Adds custom event fetching logic to the base contract before caching.
    return extendReadWriteContract({
      ...options,
      contract: viemReadWriteContract,
      network: viemNetwork,
    });
  };
}
