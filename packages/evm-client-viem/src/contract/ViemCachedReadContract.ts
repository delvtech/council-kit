import { CachedReadContract, SimpleCache } from "@council/evm-client";
import {
  ViemReadContract,
  ViemReadContractOptions,
} from "src/contract/ViemReadContract";
import { Abi } from "viem";

export interface ViemCachedReadContractOptions<TAbi extends Abi = Abi>
  extends ViemReadContractOptions<TAbi> {
  cache?: SimpleCache;
  id?: string;
}

export class ViemCachedReadContract<
  TAbi extends Abi = Abi,
> extends CachedReadContract<TAbi> {
  constructor({
    abi,
    address,
    publicClient,
    cache,
    id,
  }: ViemCachedReadContractOptions<TAbi>) {
    super({
      contract: new ViemReadContract({
        abi,
        address,
        publicClient,
      }),
      cache,
      id,
    });
  }
}
