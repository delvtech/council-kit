import {
  CachedReadContract,
  CachedReadContractOptions,
  CachedReadWriteContract,
} from "@council/evm-client";
import { Abi } from "abitype";

export interface CachedContractFactoryOptions<TAbi extends Abi = Abi>
  extends Omit<CachedReadContractOptions, "contract"> {
  abi: TAbi;
  address: string;
}

export type CachedReadContractFactory<
  TOptions extends Record<string, any> = Record<never, never>,
> = <TAbi extends Abi = Abi>(
  options: CachedContractFactoryOptions<TAbi> & TOptions,
) => CachedReadContract<TAbi>;

export type CachedReadWriteContractFactory<
  TOptions extends Record<string, any> = Record<never, never>,
> = <TAbi extends Abi = Abi>(
  options: CachedContractFactoryOptions<TAbi> & TOptions,
) => CachedReadWriteContract<TAbi>;
