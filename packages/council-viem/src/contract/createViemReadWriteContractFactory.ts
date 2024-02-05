import { createViemCachedReadWriteContract } from "@council/evm-client-viem";
import { CachedReadWriteContractFactory } from "@delvtech/council-core";
import { CreateViemReadContractFactoryOptions } from "src/contract/createViemReadContractFactory";
import { WalletClient } from "viem";

export interface CreateViemReadWriteContractFactoryOptions
  extends CreateViemReadContractFactoryOptions {
  walletClient: WalletClient;
}

export function createViemReadWriteContractFactory(
  options: CreateViemReadWriteContractFactoryOptions,
): CachedReadWriteContractFactory {
  return (factoryOptions) => {
    return createViemCachedReadWriteContract({
      ...options,
      ...factoryOptions,
    });
  };
}
