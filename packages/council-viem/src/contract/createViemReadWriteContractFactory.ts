import { createViemCachedReadWriteContract } from "@council/evm-client-viem";
import { CachedReadWriteContractFactory } from "@delvtech/council-core";
import { CreateViemReadContractFactoryOptions } from "src/contract/createViemReadContractFactory";
import { WalletClient } from "viem";

export interface CreateViemReadWriteContractFactoryOptions
  extends CreateViemReadContractFactoryOptions {
  walletClient: WalletClient;
}

export function createViemReadWriteContractFactory(
  factoryOptions: CreateViemReadWriteContractFactoryOptions,
): CachedReadWriteContractFactory {
  return (instanceOptions) => {
    return createViemCachedReadWriteContract({
      ...factoryOptions,
      ...instanceOptions,
    });
  };
}
