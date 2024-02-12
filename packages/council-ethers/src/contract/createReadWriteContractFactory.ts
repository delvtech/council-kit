import { CachedReadWriteContractFactory } from "@delvtech/council-core";
import { createCachedReadWriteContract } from "@delvtech/evm-client-ethers";
import { Signer } from "ethers";
import { CreateReadContractFactoryOptions } from "src/contract/createReadContractFactory";

export interface CreateReadWriteContractFactoryOptions
  extends CreateReadContractFactoryOptions {
  signer: Signer;
}

export function createReadWriteContractFactory(
  options: CreateReadWriteContractFactoryOptions,
): CachedReadWriteContractFactory {
  return (factoryOptions) => {
    return createCachedReadWriteContract({
      ...options,
      ...factoryOptions,
    });
  };
}
