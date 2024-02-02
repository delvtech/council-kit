import {
  AbiArrayType,
  arrayToFriendly,
  ContractDecodeFunctionDataArgs,
  ContractEncodeFunctionDataArgs,
  ContractGetEventsArgs,
  ContractReadArgs,
  ContractWriteArgs,
  DecodedFunctionData,
  Event,
  EventArgs,
  EventName,
  friendlyToArray,
  FunctionName,
  FunctionReturn,
  ReadContract,
} from "@council/evm-client";
import { createSimulateContractParameters } from "src/contract/utils/createSimulateContractParameters";
import {
  Abi,
  Address,
  decodeFunctionData,
  encodeFunctionData,
  PublicClient,
} from "viem";

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
  abi: TAbi;
  address: Address;
  publicClient: PublicClient;

  constructor({ abi, address, publicClient }: ViemReadContractOptions<TAbi>) {
    this.abi = abi;
    this.address = address;
    this.publicClient = publicClient;
  }

  async read<TFunctionName extends FunctionName<TAbi>>(
    ...[functionName, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    const argsArray = friendlyToArray({
      abi: this.abi as Abi,
      type: "function",
      name: functionName,
      kind: "inputs",
      value: args,
    });

    const output = await this.publicClient.readContract({
      abi: this.abi as Abi,
      address: this.address,
      functionName,
      args: argsArray,
      ...options,
    });

    const arrayOutput = (
      Array.isArray(output) ? output : [output]
    ) as AbiArrayType<TAbi, "function", TFunctionName, "outputs">;

    return arrayToFriendly({
      abi: this.abi,
      type: "function",
      name: functionName,
      kind: "outputs",
      values: arrayOutput,
    });
  }

  async simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[functionName, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    const argsArray = friendlyToArray({
      abi: this.abi as Abi,
      type: "function",
      name: functionName,
      kind: "inputs",
      value: args,
    });

    const { result } = await this.publicClient.simulateContract({
      abi: this.abi as any,
      address: this.address,
      functionName,
      args: argsArray,
      ...createSimulateContractParameters(options),
    });

    const arrayOutput = (
      Array.isArray(result) ? result : [result]
    ) as AbiArrayType<TAbi, "function", TFunctionName, "outputs">;

    return arrayToFriendly({
      abi: this.abi,
      type: "function",
      name: functionName,
      kind: "outputs",
      values: arrayOutput,
    });
  }

  async getEvents<TEventName extends EventName<TAbi>>(
    ...[eventName, options]: ContractGetEventsArgs<TAbi, TEventName>
  ): Promise<Event<TAbi, TEventName>[]> {
    const filter = await this.publicClient.createContractEventFilter({
      address: this.address,
      abi: this.abi as Abi,
      eventName: eventName as string,
      args: options?.filter,
      fromBlock: options?.fromBlock ?? "earliest",
      toBlock: options?.toBlock ?? "latest",
    });

    const events = await this.publicClient.getFilterLogs({ filter });

    return events.map(({ args, blockNumber, data, transactionHash }) => {
      const friendlyArgs = (
        Array.isArray(args)
          ? arrayToFriendly({
              abi: this.abi,
              type: "event",
              name: eventName,
              kind: "inputs",
              values: args as AbiArrayType<TAbi, "event", TEventName, "inputs">,
            })
          : args
      ) as EventArgs<TAbi, TEventName>;

      return {
        args: friendlyArgs,
        blockNumber: blockNumber ?? undefined,
        data,
        eventName,
        transactionHash: transactionHash ?? undefined,
      };
    });
  }

  encodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
    ...[functionName, args]: ContractEncodeFunctionDataArgs<TAbi, TFunctionName>
  ): `0x${string}` {
    const arrayArgs = friendlyToArray({
      abi: this.abi as Abi,
      type: "function",
      name: functionName,
      kind: "inputs",
      value: args,
    });

    return encodeFunctionData({
      abi: this.abi as Abi,
      functionName: functionName as string,
      args: arrayArgs,
    });
  }

  decodeFunctionData<
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    ...[data]: ContractDecodeFunctionDataArgs<TAbi, TFunctionName>
  ): DecodedFunctionData<TAbi, TFunctionName> {
    const { args, functionName } = decodeFunctionData({
      abi: this.abi,
      data,
    });

    return {
      args: arrayToFriendly({
        abi: this.abi as Abi,
        type: "function",
        name: functionName,
        kind: "inputs",
        values: (args || []) as any[],
      }),
      functionName,
    } as DecodedFunctionData<TAbi, TFunctionName>;
  }
}
