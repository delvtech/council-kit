import { Abi } from "abitype";
import { SinonStub, stub } from "sinon";
import {
  ContractDecodeFunctionDataArgs,
  ContractEncodeFunctionDataArgs,
  ContractGetEventsArgs,
  ContractGetEventsOptions,
  ContractReadArgs,
  ContractReadOptions,
  ContractWriteArgs,
  ContractWriteOptions,
  ReadContract,
} from "src/contract/types/Contract";
import { Event, EventName } from "src/contract/types/Event";
import {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/contract/types/Function";

/**
 * A mock implementation of a `ReadContract` designed to facilitate unit
 * testing. The `ReadContractStub` provides a way to stub out specific
 * contract read, write, and event-fetching behaviors, allowing tests to focus
 * on the business logic of the SDK.
 *
 * @example
 * const contract = new ReadContractStub(ERC20ABI);
 * contract.stubRead("baseToken", "0x123abc");
 *
 * const value = await contract.read("baseToken", []); // "0x123abc"
 *
 */
export class ReadContractStub<TAbi extends Abi = Abi>
  implements ReadContract<TAbi>
{
  abi;
  address = "0x0000000000000000000000000000000000000000" as const;

  // Maps to store stubs for different contract methods based on their name.
  protected readStubMap = new Map<
    FunctionName<TAbi>,
    ReadStub<TAbi, FunctionName<TAbi>>
  >();
  protected eventsStubMap = new Map<
    EventName<TAbi>,
    EventsStub<TAbi, EventName<TAbi>>
  >();
  protected simulateWriteStubMap = new Map<
    FunctionName<TAbi, "nonpayable" | "payable">,
    SimulateWriteStub<TAbi, FunctionName<TAbi, "nonpayable" | "payable">>
  >();

  constructor(abi: TAbi = [] as any) {
    this.abi = abi;
  }

  /**
   * Simulates a contract read operation for a given function. If the function
   * is not previously stubbed using `stubRead`, an error will be thrown.
   */
  async read<TFunctionName extends FunctionName<TAbi>>(
    ...[functionName, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    const stub = this.getReadStub(functionName);
    if (!stub) {
      throw new Error(
        `Called read for ${functionName} on a stubbed contract without a return value. The function must be stubbed first:\n\tcontract.stubRead("${functionName}", value)`,
      );
    }
    return stub(args, options);
  }

  /**
   * Simulates a contract write operation for a given function. If the function
   * is not previously stubbed using `stubWrite`, an error will be thrown.
   */
  async simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[functionName, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    const stub = this.getSimulateWriteStub(functionName);
    if (!stub) {
      throw new Error(
        `Called simulateWrite for ${functionName} on a stubbed contract without a return value. The function must be stubbed first:\n\tcontract.stubWrite("${functionName}", value)`,
      );
    }
    return stub(args, options);
  }

  /**
   * Simulates fetching events for a given event name from the contract. If the
   * event name is not previously stubbed using `stubEvents`, an error will be
   * thrown.
   */
  async getEvents<TEventName extends EventName<TAbi>>(
    ...[eventName, options]: ContractGetEventsArgs<TAbi, TEventName>
  ): Promise<Event<TAbi, TEventName>[]> {
    const stub = this.getEventsStub(eventName);
    if (!stub) {
      throw new Error(
        `Called getEvents for ${eventName} on a stubbed contract without a return value. The function must be stubbed first:\n\tcontract.stubEvents("${eventName}", value)`,
      );
    }
    return stub(options);
  }

  /**
   * Stubs the return value for a given function when `read` is called with that
   * function name. This method overrides any previously stubbed values for the
   * same function.
   */
  stubRead<TFunctionName extends FunctionName<TAbi>>({
    functionName,
    args,
    value,
  }: {
    functionName: TFunctionName;
    args?: FunctionArgs<TAbi, TFunctionName>;
    value: FunctionReturn<TAbi, TFunctionName>;
  }): void {
    let readStub = this.readStubMap.get(functionName);
    if (!readStub) {
      readStub = stub();
      this.readStubMap.set(functionName, readStub);
    }

    // Account for dynamic args if provided
    if (args) {
      readStub.withArgs(args).resolves(value);
      return;
    }

    readStub.resolves(value);
  }

  /**
   * Stubs the return value for a given function when `simulateWrite` is called
   * with that function name. This method overrides any previously stubbed
   * values for the same function.
   *
   * *Note: The stub doesn't account for dynamic values based on provided
   * arguments/options.*
   */
  stubSimulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    functionName: TFunctionName,
    value: FunctionReturn<TAbi, TFunctionName>,
  ): void {
    let simulateWriteStub = this.simulateWriteStubMap.get(functionName);
    if (!simulateWriteStub) {
      simulateWriteStub = stub();
      this.simulateWriteStubMap.set(functionName, simulateWriteStub);
    }
    simulateWriteStub.resolves(value);
  }

  /**
   * Stubs the return value for a given event name when `getEvents` is called
   * with that event name. This method overrides any previously stubbed values
   * for the same event.
   *
   * *Note: The stub doesn't account for dynamic values based on provided
   * arguments/options.*
   */
  stubEvents<TEventName extends EventName<TAbi>>(
    eventName: TEventName,
    value: Event<TAbi, TEventName>[],
  ): void {
    if (this.eventsStubMap.has(eventName)) {
      this.getEventsStub(eventName)!.resolves(value);
    } else {
      this.eventsStubMap.set(eventName, stub().resolves(value) as any);
    }
  }

  /**
   * Retrieves the stub associated with a read function name.
   * Useful for assertions in testing, such as checking call counts.
   */
  getReadStub<TFunctionName extends FunctionName<TAbi>>(
    functionName: TFunctionName,
  ): ReadStub<TAbi, TFunctionName> | undefined {
    return this.readStubMap.get(functionName) as
      | ReadStub<TAbi, TFunctionName>
      | undefined;
  }

  /**
   * Retrieves the stub associated with a write function name.
   * Useful for assertions in testing, such as checking call counts.
   */
  getSimulateWriteStub<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    functionName: TFunctionName,
  ): SimulateWriteStub<TAbi, TFunctionName> | undefined {
    return this.simulateWriteStubMap.get(functionName) as
      | SimulateWriteStub<TAbi, TFunctionName>
      | undefined;
  }

  /**
   * Retrieves the stub associated with an event name.
   * Useful for assertions in testing, such as checking call counts.
   */
  getEventsStub<TEventName extends EventName<TAbi>>(
    eventName: TEventName,
  ): EventsStub<TAbi, TEventName> | undefined {
    return this.eventsStubMap.get(eventName) as
      | EventsStub<TAbi, TEventName>
      | undefined;
  }

  // TODO:
  decodeFunctionData<
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    ...args: ContractDecodeFunctionDataArgs
  ): DecodedFunctionData<TAbi, TFunctionName> {
    throw new Error("Method not implemented.");
  }

  // TODO:
  encodeFunctionData<
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    ...args: ContractEncodeFunctionDataArgs<TAbi, TFunctionName>
  ): `0x${string}` {
    throw new Error("Method not implemented.");
  }
}

/**
 * Type representing a stub for the "read" function of a contract.
 */
type ReadStub<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> = SinonStub<
  [args?: FunctionArgs<TAbi, TFunctionName>, options?: ContractReadOptions],
  Promise<FunctionReturn<TAbi, TFunctionName>>
>;

/**
 * Type representing a stub for the "getEvents" function of a contract.
 */
type EventsStub<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = SinonStub<
  [options?: ContractGetEventsOptions<TAbi, TEventName>],
  Promise<Event<TAbi, TEventName>[]>
>;

/**
 * Type representing a stub for the "write" and "simulateWrite" functions of a
 * contract.
 */
type SimulateWriteStub<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
> = SinonStub<
  [
    args?: FunctionArgs<TAbi, TFunctionName> | undefined,
    options?: ContractWriteOptions,
  ],
  Promise<FunctionReturn<TAbi, TFunctionName>>
>;
