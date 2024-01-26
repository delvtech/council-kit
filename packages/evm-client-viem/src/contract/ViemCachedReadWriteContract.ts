import { CachedReadWriteContract, SimpleCache } from "@council/evm-client";
import {
  ViemReadWriteContract,
  ViemReadWriteContractOptions,
} from "src/contract/ViemReadWriteContract";
import { Abi } from "viem";

export interface ViemCachedReadWriteContractOptions<TAbi extends Abi = Abi>
  extends ViemReadWriteContractOptions<TAbi> {
  cache?: SimpleCache;
  id?: string;
}

export class ViemCachedReadWriteContract<
  TAbi extends Abi = Abi,
> extends CachedReadWriteContract<TAbi> {
  constructor({
    abi,
    address,
    publicClient,
    walletClient,
    cache,
    id,
  }: ViemCachedReadWriteContractOptions<TAbi>) {
    super({
      contract: new ViemReadWriteContract({
        abi,
        address,
        publicClient,
        walletClient,
      }),
      cache,
      id,
    });
  }
}
