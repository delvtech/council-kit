import { createEthersCachedReadWriteContract } from "@council/evm-client-ethers";
import { CachedReadWriteContractFactory } from "@delvtech/council-core";
import { Signer } from "ethers";
import { CreateEthersReadContractFactoryOptions } from "src/contract/createEthersReadContractFactory";

export interface CreateEthersReadWriteContractFactoryOptions
  extends CreateEthersReadContractFactoryOptions {
  signer: Signer;
}

export function createEthersReadWriteContractFactory(
  options: CreateEthersReadWriteContractFactoryOptions,
): CachedReadWriteContractFactory {
  return (factoryOptions) => {
    return createEthersCachedReadWriteContract({
      ...options,
      ...factoryOptions,
    });
  };
}
