import {
  CachedReadContract,
  CachedReadWriteContract,
  CreateCachedReadContractOptions,
  CreateCachedReadWriteContractOptions,
} from "@delvtech/evm-client";
import { Abi } from "abitype";

interface BaseContractFactoryOptions<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: `0x${string}`;
}

export interface ReadContractFactoryOptions<TAbi extends Abi = Abi>
  extends Omit<CreateCachedReadContractOptions, "contract">,
    BaseContractFactoryOptions<TAbi> {}

export type ReadContractFactory = <TAbi extends Abi = Abi>(
  options: ReadContractFactoryOptions<TAbi>,
) => CachedReadContract<TAbi>;

export interface ReadWriteContractFactoryOptions<TAbi extends Abi = Abi>
  extends Omit<CreateCachedReadWriteContractOptions, "contract">,
    BaseContractFactoryOptions<TAbi> {}

export type ReadWriteContractFactory = <TAbi extends Abi = Abi>(
  options: ReadWriteContractFactoryOptions<TAbi>,
) => CachedReadWriteContract<TAbi>;
