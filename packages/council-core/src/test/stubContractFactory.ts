import {
  CachedReadContract,
  createCachedReadContract,
} from "@delvtech/evm-client";
import { ReadContractStub } from "@delvtech/evm-client/stubs";
import { Abi } from "abitype";
import { ContractFactoryOptions } from "src/exports";
import { Prettify } from "src/types";

/**
 * A cached read contract combined with a read contract stub.
 */
export type CachedReadContractStub<TAbi extends Abi = Abi> = Prettify<
  CachedReadContract<TAbi> & ReadContractStub<TAbi>
>;

/**
 * A factory for creating cached read contract stubs.
 */
export function stubContractFactory<TAbi extends Abi = Abi>({
  abi,
}: ContractFactoryOptions<TAbi>): CachedReadContractStub<TAbi> {
  return createCachedReadContract({
    contract: new ReadContractStub(abi),
  }) as CachedReadContractStub<TAbi>;
}
