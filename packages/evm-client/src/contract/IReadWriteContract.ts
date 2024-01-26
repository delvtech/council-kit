import { Abi, Address } from "abitype";
import {
  FunctionName,
  FunctionArgs,
  FunctionReturnType,
} from "src/base/abitype";
import { IReadContract } from "./IReadContract";

/**
 * Interface representing a writable contract with specified ABI.
 * Extends IReadContract to also include write operations.
 */

export interface IReadWriteContract<TAbi extends Abi = Abi>
  extends IReadContract<TAbi> {
  /**
   * Writes to a specified function on the contract.
   */
  write<TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptionsWithCallback,
  ): Promise<FunctionReturnType<TAbi, TFunctionName>>;
} // https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L274

export interface ContractWriteOptions {
  type?: `0x${string}`;
  nonce?: bigint;
  to?: Address;
  from?: Address;
  /**
   * Gas limit
   */
  gas?: bigint;
  value?: bigint;
  input?: `0x${string}`;
  /**
   * The gas price willing to be paid by the sender in wei
   */
  gasPrice?: bigint;
  /**
   * Maximum fee per gas the sender is willing to pay to miners in wei
   */
  maxPriorityFeePerGas?: bigint;
  /**
   * The maximum total fee per gas the sender is willing to pay (includes the
   * network / base fee and miner / priority fee) in wei
   */
  maxFeePerGas?: bigint;
  /**
   * EIP-2930 access list
   */
  accessList?: {
    address: `0x${string}`;
    storageKeys: `0x${string}`[];
  }[];
  /**
   * Chain ID that this transaction is valid on.
   */
  chainId?: bigint;
}
export interface ContractWriteOptionsWithCallback extends ContractWriteOptions {
  /**
   * Called when a transaction is submitted on chain.
   */
  onSubmitted?: (hash: `0x${string}`) => void;
}
