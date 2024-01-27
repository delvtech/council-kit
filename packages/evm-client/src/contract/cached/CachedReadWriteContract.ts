import { Abi } from "abitype";
import {
  FunctionArgs,
  FunctionName,
  FunctionReturnType,
} from "src/base/abitype";
import {
  ContractWriteOptions,
  ReadWriteContract,
} from "src/contract/ReadWriteContract";
import {
  CachedReadContractOptions,
  CachedReadContract,
} from "src/contract/cached/CachedReadContract/CachedReadContract";

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
  protected readonly _contract: ReadWriteContract<TAbi>;

  constructor({ contract, cache, id }: CachedReadWriteContractOptions<TAbi>) {
    super({ contract, cache, id });
    this._contract = contract;
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
  ): Promise<FunctionReturnType<TAbi, TFunctionName>> {
    return this._contract.write(fn, args, options);
  }
}
