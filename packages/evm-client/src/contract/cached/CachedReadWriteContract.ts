import { Abi } from "abitype";
import { FunctionArgs, FunctionName } from "src/base/abitype";
import {
  CachedReadContract,
  CachedReadContractOptions,
} from "src/contract/cached/CachedReadContract/CachedReadContract";
import {
  ContractWriteOptions,
  ReadWriteContract,
} from "src/contract/ReadWriteContract";

export interface CachedReadWriteContractOptions<TAbi extends Abi = Abi>
  extends CachedReadContractOptions<TAbi> {
  contract: ReadWriteContract<TAbi>;
}

/**
 * Provides a cached wrapper around an Ethereum writable contract. This class is
 * useful for both reading (with caching) and writing to a contract. It extends
 * the functionality provided by CachedReadContract by adding write
 * capabilities.
 */
export class CachedReadWriteContract<TAbi extends Abi = Abi>
  extends CachedReadContract<TAbi>
  implements ReadWriteContract<TAbi>
{
  /** The wrapped writable contract instance. */
  declare contract: ReadWriteContract<TAbi>;

  constructor(options: CachedReadWriteContractOptions<TAbi>) {
    super(options);
  }

  /**
   * Writes data to the contract. This method directly delegates to the
   * underlying contract without interacting with the cache since writes
   * inherently modify state and cannot be cached.
   */
  write<TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    fn: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ): Promise<`0x${string}`> {
    return this.contract.write(fn, args, options);
  }
}
