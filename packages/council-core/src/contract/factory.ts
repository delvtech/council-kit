import {
  CachedReadContract,
  CachedReadWriteContract,
  CreateCachedReadContractOptions,
} from "@delvtech/evm-client";
import { Abi } from "abitype";
import { Prettify } from "src/types";

export type ContractFactoryOptions<TAbi extends Abi = Abi> = Prettify<
  Omit<CreateCachedReadContractOptions, "contract"> & {
    abi: TAbi;
    address: `0x${string}`;
  }
>;

export type ReadContractFactory = <TAbi extends Abi = Abi>(
  options: ContractFactoryOptions<TAbi>,
) => CachedReadContract<TAbi>;

export type ReadWriteContractFactory = <TAbi extends Abi = Abi>(
  options: ContractFactoryOptions<TAbi>,
) => CachedReadWriteContract<TAbi>;
