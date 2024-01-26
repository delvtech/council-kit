import { Abi } from "abitype";
import { stub, SinonStub } from "sinon";
import {
  EventName,
  FunctionArgs,
  FunctionName,
  FunctionReturnType,
} from "src/base/abitype";
import {
  ContractEvent,
  ContractGetEventsOptions,
} from "src/contract/ContractEvents";
import { ContractWriteOptions } from "src/contract/IReadWriteContract";
import { ContractReadOptions, IReadContract } from "src/contract/IReadContract";

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
  implements IReadContract<TAbi>
{
  abi;
  address = "0x0000000000000000000000000000000000000000" as `0x${string}`;

  // Maps to store stubs for different contract methods based on their name.
  protected readStubMap = new Map<
    FunctionName<TAbi>,
    ReadStub<TAbi, FunctionName<TAbi>>
  >();
  protected eventsStubMap = new Map<
    EventName<TAbi>,
    EventsStub<TAbi, EventName<TAbi>>
  >();
  protected writeStubMap = new Map<
    FunctionName<TAbi, "nonpayable" | "payable">,
    WriteStub<TAbi, FunctionName<TAbi, "nonpayable" | "payable">>
  >();

  constructor(abi: TAbi = [] as any) {
    this.abi = abi;
  }

  /**
   * Simulates a contract read operation for a given function. If the function
   * is not previously stubbed using `stubRead`, an error will be thrown.
   */
  read = stub().callsFake(
    <TFunctionName extends FunctionName<TAbi>>(
      functionName: TFunctionName,
      args: FunctionArgs<TAbi, TFunctionName>,
      options?: ContractReadOptions,
    ) => {
      const stub = this.readStubMap.get(functionName);
      if (!stub) {
        throw new Error(
          `Called read for ${functionName} on a stubbed contract without a return value. The function must be stubbed first:\n\tcontract.stubRead("${functionName}", value)`,
        );
      }
      return stub(args, options);
    },
  );

  /**
   * Simulates a contract write operation for a given function. If the function
   * is not previously stubbed using `stubWrite`, an error will be thrown.
   */
  simulateWrite = stub().callsFake(
    <TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
      functionName: TFunctionName,
      args: FunctionArgs<TAbi, TFunctionName>,
      options?: ContractWriteOptions,
    ) => {
      const stub = this.writeStubMap.get(functionName);
      if (!stub) {
        throw new Error(
          `Called simulateWrite for ${functionName} on a stubbed contract without a return value. The function must be stubbed first:\n\tcontract.stubWrite("${functionName}", value)`,
        );
      }
      return stub(args, options);
    },
  );

  /**
   * Simulates fetching events for a given event name from the contract. If the
   * event name is not previously stubbed using `stubEvents`, an error will be
   * thrown.
   */
  getEvents = stub().callsFake(
    <TEventName extends EventName<TAbi>>(
      eventName: TEventName,
      options?: ContractGetEventsOptions<TAbi, TEventName>,
    ) => {
      const stub = this.eventsStubMap.get(eventName);
      if (!stub) {
        throw new Error(
          `Called getEvents for ${eventName} on a stubbed contract without a return value. The function must be stubbed first:\n\tcontract.stubEvents("${eventName}", value)`,
        );
      }
      return stub(options);
    },
  );

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
    value: MaybePromise<FunctionReturnType<TAbi, TFunctionName>>;
  }): void {
    let readStubFromMap = this.readStubMap.get(functionName);
    if (!readStubFromMap) {
      readStubFromMap = stub() as ReadStub<TAbi, FunctionName<TAbi>>;
      this.readStubMap.set(functionName, readStubFromMap);
    }

    // Account for dynamic args if provied
    if (args) {
      readStubFromMap.withArgs(args).resolves(value as any) as ReadStub<
        TAbi,
        FunctionName<TAbi>
      >;
      return;
    }

    readStubFromMap.resolves(value as any) as ReadStub<
      TAbi,
      FunctionName<TAbi>
    >;
  }

  /**
   * Stubs the return value for a given function when `simulateWrite` is called
   * with that function name. This method overrides any previously stubbed
   * values for the same function.
   *
   * *Note: The stub doesn't account for dynamic values based on provided
   * arguments/options.*
   */
  stubWrite<TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    functionName: TFunctionName,
    value: MaybePromise<FunctionReturnType<TAbi, TFunctionName>>,
  ): void {
    this.writeStubMap.set(
      functionName,
      stub().resolves(value) as WriteStub<TAbi, FunctionName<TAbi>>,
    );
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
    value: MaybePromise<ContractEvent<TAbi, TEventName>[]>,
  ): void {
    this.eventsStubMap.set(
      eventName,
      stub().resolves(value) as EventsStub<TAbi, EventName<TAbi>>,
    );
  }

  /**
   * Retrieves the stub associated with a read function name.
   * Useful for assertions in testing, such as checking call counts.
   */
  getReadStub<TFunctionName extends FunctionName<TAbi>>(
    functionName: TFunctionName,
  ): ReadStub<TAbi, TFunctionName> | undefined {
    return this.readStubMap.get(functionName);
  }

  /**
   * Retrieves the stub associated with a write function name.
   * Useful for assertions in testing, such as checking call counts.
   */
  getWriteStub<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(functionName: TFunctionName): WriteStub<TAbi, TFunctionName> | undefined {
    return this.writeStubMap.get(functionName);
  }

  /**
   * Retrieves the stub associated with an event name.
   * Useful for assertions in testing, such as checking call counts.
   */
  getEventsStub<TEventName extends EventName<TAbi>>(
    eventName: TEventName,
  ): EventsStub<TAbi, TEventName> | undefined {
    return this.eventsStubMap.get(eventName) as EventsStub<TAbi, TEventName>;
  }
}

type MaybePromise<T> = Promise<T> | T;

/**
 * Type representing a stub for the "read" function of a contract.
 */
type ReadStub<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> = SinonStub<
  [FunctionArgs<TAbi, TFunctionName>, ContractReadOptions?],
  MaybePromise<FunctionReturnType<TAbi, TFunctionName>>
>;

/**
 * Type representing a stub for the "write" and "simulateWrite" functions of a
 * contract.
 */
type WriteStub<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
> = SinonStub<
  [FunctionArgs<TAbi, TFunctionName>, ContractWriteOptions?],
  MaybePromise<FunctionReturnType<TAbi, TFunctionName>>
>;

/**
 * Type representing a stub for the "getEvents" function of a contract.
 */
type EventsStub<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = SinonStub<
  [ContractGetEventsOptions<TAbi, TEventName>?],
  MaybePromise<ContractEvent<TAbi, TEventName>[]>
>;
