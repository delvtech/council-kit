import {
  ContractEvent,
  ContractGetEventsOptions,
  ContractReadOptions,
  ContractWriteOptions,
  EventArgs,
  EventName,
  FunctionArgs,
  functionArgsToArray,
  FunctionName,
  FunctionReturnType,
  ReadContract,
} from "@council/evm-client";
import { createSimulateContractParameters } from "src/contract/utils/createSimulateContractParameters";
import { Abi, Address, PublicClient } from "viem";

export interface ViemReadContractOptions<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: Address;
  publicClient: PublicClient;
}

/**
 * A viem implementation of the ReadContract interface.
 * @see https://viem.sh/
 */
export class ViemReadContract<TAbi extends Abi = Abi>
  implements ReadContract<TAbi>
{
  readonly abi: TAbi;
  readonly address: Address;

  protected readonly _publicClient: PublicClient;

  constructor({ abi, address, publicClient }: ViemReadContractOptions<TAbi>) {
    this.abi = abi;
    this.address = address;
    this._publicClient = publicClient;
  }

  async read<TFunctionName extends FunctionName<TAbi>>(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ): Promise<FunctionReturnType<TAbi, TFunctionName>> {
    const result = await this._publicClient.readContract({
      abi: this.abi as any,
      address: this.address,
      functionName,
      args: functionArgsToArray({
        args,
        abi: this.abi,
        functionName,
      }),
      ...options,
    });

    if (Array.isArray(result) && result.length === 1) {
      return result[0];
    } else {
      return result as FunctionReturnType<TAbi, TFunctionName>;
    }
  }

  async simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    functionName: TFunctionName,
    args: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ): Promise<FunctionReturnType<TAbi, TFunctionName>> {
    const { result } = await this._publicClient.simulateContract({
      abi: this.abi as any,
      address: this.address,
      functionName,
      args: functionArgsToArray({
        args,
        abi: this.abi,
        functionName,
      }),
      ...createSimulateContractParameters(options),
    });

    if (Array.isArray(result) && result.length === 1) {
      return result[0];
    } else {
      return result as FunctionReturnType<TAbi, TFunctionName>;
    }
  }

  async getEvents<TEventName extends EventName<TAbi>>(
    eventName: TEventName,
    options?: ContractGetEventsOptions<TAbi, TEventName>,
  ): Promise<ContractEvent<TAbi, TEventName>[]> {
    const filter = await this._publicClient.createContractEventFilter({
      address: this.address,
      abi: this.abi,
      eventName: eventName as any,
      args: options?.filter as any,
      fromBlock: options?.fromBlock ?? "earliest",
      toBlock: options?.toBlock ?? "latest",
    });

    const events = await this._publicClient.getFilterLogs({ filter });

    return events.map(({ args, blockNumber, data, transactionHash }) => {
      return {
        args: args as EventArgs<TAbi, typeof eventName>,
        blockNumber: blockNumber ?? undefined,
        data,
        eventName,
        transactionHash: transactionHash ?? undefined,
      };
    });
  }
}
