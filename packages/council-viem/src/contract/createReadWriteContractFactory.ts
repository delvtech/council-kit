import { ReadWriteContractFactory } from "@delvtech/council-core";
import { createCachedReadWriteContract } from "@delvtech/evm-client-viem";
import { CreateReadContractFactoryOptions } from "src/contract/createReadContractFactory";
import { WalletClient } from "viem";

export interface CreateReadWriteContractFactoryOptions
  extends CreateReadContractFactoryOptions {
  walletClient: WalletClient;
}

export function createReadWriteContractFactory(
  factoryOptions: CreateReadWriteContractFactoryOptions,
): ReadWriteContractFactory {
  return (instanceOptions) => {
    // const options = {
    //   ...factoryOptions,
    //   ...instanceOptions,
    // };

    // const viemReadWriteContract = createReadWriteContract({
    //   abi: options.abi,
    //   address: options.address,
    //   publicClient: options.publicClient,
    //   walletClient: options.walletClient,
    // });

    // const viemNetwork = createNetwork(options.publicClient);

    // Adds custom event fetching logic to the base contract before caching.
    return createCachedReadWriteContract({
      ...factoryOptions,
      ...instanceOptions,
    });
  };
}
