import { Abi, Address } from "abitype";
import { Event, EventFilter, EventName } from "src/contract/Event";
import {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/contract/Function";
import { BlockTag } from "src/network/Block";

/**src/contract/Function
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
    ...args: ContractReadArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  /**
   * Simulates a write operation on a specified function of the contract.
   */
  simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...args: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  /**
   * Retrieves specified events from the contract.
   */
  getEvents<TEventName extends EventName<TAbi>>(
    ...args: ContractGetEventsArgs<TAbi, TEventName>
  ): Promise<Event<TAbi, TEventName>[]>;

  encodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
    ...args: ContractEncodeFunctionDataArgs<TAbi, TFunctionName>
  ): `0x${string}`;

  decodeFunctionData<
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    ...args: ContractDecodeFunctionDataArgs<TAbi, TFunctionName>
  ): DecodedFunctionData<TAbi, TFunctionName>;
}

/**
 * Interface representing a writable contract with specified ABI.
 * Extends IReadContract to also include write operations.
 */
export interface ReadWriteContract<TAbi extends Abi = Abi>
  extends ReadContract<TAbi> {
  /**
   * Writes to a specified function on the contract.
   * @returns The transaction hash of the submitted transaction.
   */
  write<TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    ...args: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<`0x${string}`>;
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

export type ContractReadArgs<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> =
  FunctionArgs<TAbi, TFunctionName> extends undefined
    ? [
        functionName: TFunctionName,
        args?: undefined,
        options?: ContractReadOptions,
      ]
    : [
        functionName: TFunctionName,
        args: FunctionArgs<TAbi, TFunctionName>,
        options?: ContractReadOptions,
      ];

export interface ContractGetEventsOptions<
  TAbi extends Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> {
  filter?: EventFilter<TAbi, TEventName>;
  fromBlock?: bigint | BlockTag;
  toBlock?: bigint | BlockTag;
}

export type ContractGetEventsArgs<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = [
  eventName: TEventName,
  options?: ContractGetEventsOptions<TAbi, TEventName>,
];

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L274
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

export type ContractWriteArgs<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
> =
  FunctionArgs<TAbi, TFunctionName> extends undefined
    ? [
        functionName: TFunctionName,
        args?: undefined,
        options?: ContractWriteOptions,
      ]
    : [
        functionName: TFunctionName,
        args: FunctionArgs<TAbi, TFunctionName>,
        options?: ContractWriteOptions,
      ];

export type ContractEncodeFunctionDataArgs<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> =
  FunctionArgs<TAbi, TFunctionName> extends undefined
    ? [functionName: TFunctionName, args?: undefined]
    : [functionName: TFunctionName, args: FunctionArgs<TAbi, TFunctionName>];

export type ContractDecodeFunctionDataArgs<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = [data: `0x${string}`, functionName?: TFunctionName];
