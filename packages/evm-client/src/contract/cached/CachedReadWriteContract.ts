import { Abi } from "abitype";
import {
  FunctionArgs,
  FunctionName,
  FunctionReturnType,
} from "src/base/abitype";
import {
  ContractWriteOptions,
  IReadWriteContract,
} from "src/contract/IReadWriteContract";
import {
  CachedReadContract,
  CachedReadContractOptions,
  ICachedReadContract,
} from "src/contract/cached/CachedReadContract/CachedReadContract";

/**
 * Interface for a writable contract that also provides caching capabilities.
 * This extends both readable cached contracts and writable contracts.
 */
export interface ICachedReadWriteContract<TAbi extends Abi = Abi>
  extends ICachedReadContract<TAbi>,
    IReadWriteContract<TAbi> {}

export interface CachedReadWriteContractOptions<TAbi extends Abi = Abi>
  extends CachedReadContractOptions<TAbi> {
  contract: IReadWriteContract<TAbi>;
}

/**
 * Provides a cached wrapper around an Ethereum writable contract. This class is
 * useful for both reading (with caching) and writing to a contract. It extends
 * the functionality provided by CachedReadContract by adding write
 * capabilities.
 */
export class CachedReadWriteContract<TAbi extends Abi = Abi>
  extends CachedReadContract<TAbi>
  implements ICachedReadWriteContract<TAbi>
{
  /** The wrapped writable contract instance. */
  protected readonly _contract: IReadWriteContract<TAbi>;

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
