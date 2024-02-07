import {
  CachedReadContract,
  SimpleCache,
  createCachedReadContract,
} from "@council/evm-client";
import { Abi } from "abitype";
import {
  EthersReadContractOptions,
  createEthersReadContract,
} from "src/contract/createEthersReadContract";

export interface CreateEthersCachedReadContractOptions<TAbi extends Abi = Abi>
  extends EthersReadContractOptions<TAbi> {
  cache?: SimpleCache;
  namespace?: string;
}

export function createEthersCachedReadContract<TAbi extends Abi = Abi>({
  abi,
  address,
  provider,
  ethersContract,
  cache,
  namespace,
}: CreateEthersCachedReadContractOptions<TAbi>): CachedReadContract<TAbi> {
  return createCachedReadContract({
    contract: createEthersReadContract({
      abi,
      address,
      provider,
      ethersContract,
    }),
    cache,
    namespace,
  });
}
