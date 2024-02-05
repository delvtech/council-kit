import {
  CachedReadWriteContract,
  SimpleCache,
  createCachedReadWriteContract,
} from "@council/evm-client";
import { Abi } from "abitype";
import {
  EthersReadWriteContractOptions,
  createEthersReadWriteContract,
} from "src/contract/createEthersReadWriteContract";

export interface CreateEthersCachedReadWriteContractOptions<
  TAbi extends Abi = Abi,
> extends EthersReadWriteContractOptions<TAbi> {
  cache?: SimpleCache;
  namespace?: string;
}

export function createEthersCachedReadWriteContract<TAbi extends Abi = Abi>({
  abi,
  address,
  provider,
  signer,
  ethersContract,
  readContract,
  cache,
  namespace,
}: CreateEthersCachedReadWriteContractOptions<TAbi>): CachedReadWriteContract<TAbi> {
  return createCachedReadWriteContract({
    contract: createEthersReadWriteContract({
      abi,
      address,
      provider,
      signer,
      ethersContract,
      readContract,
    }),
    cache,
    namespace,
  });
}
