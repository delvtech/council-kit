import { Abi } from "abitype";
import {
  CachedReadContract,
  CachedReadContractOptions,
} from "src/contract/implementations/CachedReadContract";
import {
  ContractWriteArgs,
  ReadWriteContract,
} from "src/contract/types/Contract";
import { FunctionName } from "src/contract/types/Function";

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
  declare contract: ReadWriteContract<TAbi>;

  constructor(options: CachedReadWriteContractOptions<TAbi>) {
    super(options);
  }

  getSignerAddress(): Promise<`0x${string}`> {
    return this.contract.getSignerAddress();
  }

  write<TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    ...[functionName, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<`0x${string}`> {
    return this.contract.write(functionName, args, options);
  }
}
