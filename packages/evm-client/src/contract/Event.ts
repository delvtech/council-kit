import { Abi } from "abitype";
import {
  AbiEntry,
  AbiParametersToObject,
  NamedAbiParameter,
  NamedParametersToObject,
} from "src/contract/AbiEntry";
import { FunctionName } from "src/contract/Function";

/**
 * Get a union of event names from an abi
 */
export type EventName<TAbi extends Abi> = AbiEntry<TAbi, "event">["name"];

type NamedEventInput<
  TAbi extends Abi,
  TEventName extends FunctionName<TAbi>,
> = Extract<AbiEntry<TAbi, "event", TEventName>["inputs"], NamedAbiParameter>;

/**
 * Get an object type for an event's fields from an abi
 */
export type EventArgs<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = AbiParametersToObject<AbiEntry<TAbi, "event", TEventName>["inputs"]>;

/**
 * Get a union of indexed input objects for an event from an abi
 */
type IndexedEventInput<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Extract<NamedEventInput<TAbi, TEventName>, { indexed: true }>;

/**
 * Get an object type for an event's indexed fields from an abi
 */
export type EventFilter<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Partial<
  NamedParametersToObject<IndexedEventInput<TAbi, TEventName>[], "inputs">
>;

/**
 * A strongly typed event object based on an abi
 */
export interface Event<
  TAbi extends Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> {
  eventName: TEventName;
  args: EventArgs<TAbi, TEventName>;
  data?: `0x${string}`;
  blockNumber?: bigint;
  transactionHash?: `0x${string}`;
}
