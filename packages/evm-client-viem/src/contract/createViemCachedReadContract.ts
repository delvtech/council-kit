import {
  CachedReadContract,
  SimpleCache,
  createCachedReadContract,
} from "@council/evm-client";
import {
  CreateViemReadContractOptions,
  createViemReadContract,
} from "src/contract/createViemReadContract";
import { Abi } from "viem";

export interface CreateViemCachedReadContractOptions<TAbi extends Abi = Abi>
  extends CreateViemReadContractOptions<TAbi> {
  cache?: SimpleCache;
  namespace?: string;
}

export function createViemCachedReadContract<TAbi extends Abi = Abi>({
  abi,
  address,
  publicClient,
  cache,
  namespace,
}: CreateViemCachedReadContractOptions<TAbi>): CachedReadContract<TAbi> {
  return createCachedReadContract({
    contract: createViemReadContract({
      abi,
      address,
      publicClient,
    }),
    cache,
    namespace,
  });
}
