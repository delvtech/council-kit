import { createCachedReadWriteContract } from "@council/evm-client-viem";
import { CachedReadWriteContractFactory } from "@delvtech/council-core";
import { CreateReadContractFactoryOptions } from "src/contract/createReadContractFactory";
import { WalletClient } from "viem";

export interface CreateReadWriteContractFactoryOptions
  extends CreateReadContractFactoryOptions {
  walletClient: WalletClient;
}

export function createReadWriteContractFactory(
  factoryOptions: CreateReadWriteContractFactoryOptions,
): CachedReadWriteContractFactory {
  return (instanceOptions) => {
    return createCachedReadWriteContract({
      ...factoryOptions,
      ...instanceOptions,
    });
  };
}
