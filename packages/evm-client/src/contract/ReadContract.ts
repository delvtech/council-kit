import { Abi, Address } from "abitype";
import {
  DecodedFunctionData,
  EventName,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/base/abitype";
import {
  ContractEvent,
  ContractGetEventsOptions,
} from "src/contract/ContractEvents";
import { ContractWriteOptions } from "src/contract/ReadWriteContract";
import { BlockTag } from "src/network/BlockTag";

/**
 * Interface representing a readable contract with specified ABI. Provides type
 * safe methods to read and simulate write operations on the contract.
 */
export interface ReadContract<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: Address;

  /**
   * Reads a specified function from the contract.
   */
  read<TFunctionName extends FunctionName<TAbi>>(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  /**
   * Simulates a write operation on a specified function of the contract.
   */
  simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  /**
   * Retrieves specified events from the contract.
   */
  getEvents<TEventName extends EventName<TAbi>>(
    eventName: TEventName,
    options?: ContractGetEventsOptions<TAbi, TEventName>,
  ): Promise<ContractEvent<TAbi, TEventName>[]>;

  encodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
  ): `0x${string}`;

  decodeFunctionData<
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    data: `0x${string}`,
  ): DecodedFunctionData<TAbi, TFunctionName>;
}

// https://github.com/ethereum/execution-apis/blob/main/src/eth/execute.yaml#L1
export type ContractReadOptions =
  | {
      blockNumber?: bigint;
      blockTag?: never;
    }
  | {
      blockNumber?: never;
      /**
       * @default 'latest'
       */
      blockTag?: BlockTag;
    };
