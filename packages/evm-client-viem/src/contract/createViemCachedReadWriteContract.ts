import {
  CachedReadWriteContract,
  SimpleCache,
  createCachedReadWriteContract,
} from "@council/evm-client";
import {
  ViemReadWriteContractOptions,
  createViemReadWriteContract,
} from "src/contract/createViemReadWriteContract";
import { Abi } from "viem";

export interface CreateViemCachedReadWriteContractOptions<
  TAbi extends Abi = Abi,
> extends ViemReadWriteContractOptions<TAbi> {
  cache?: SimpleCache;
  namespace?: string;
}

export function createViemCachedReadWriteContract<TAbi extends Abi = Abi>({
  abi,
  address,
  publicClient,
  walletClient,
  readContract,
  cache,
  namespace,
}: CreateViemCachedReadWriteContractOptions<TAbi>): CachedReadWriteContract<TAbi> {
  return createCachedReadWriteContract({
    contract: createViemReadWriteContract({
      abi,
      address,
      publicClient,
      walletClient,
      readContract,
    }),
    cache,
    namespace,
  });
}
