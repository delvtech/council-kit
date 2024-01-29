import {
  CachedReadContract,
  CachedReadWriteContract,
} from "@council/evm-client";
import { Abi } from "abitype";
import { DataSource } from "src/datasources/base/DataSource";

/**
 * @category Context
 */
export interface CouncilContextOptions {
  dataSources?: DataSource[];
}

/**
 * The Context stores common information used in model and data source methods
 * including shared data sources and their cache. It also includes a few
 * utility methods for working with data sources.
 * @category Context
 */
export interface CouncilContext {
  getReadContract<TAbi extends Abi = Abi>(
    address: string,
    abi: TAbi,
  ): CachedReadContract<TAbi>;
  getReadWriteContract<TAbi extends Abi = Abi>(
    address: string,
    abi: TAbi,
  ): CachedReadWriteContract<TAbi>;
}
