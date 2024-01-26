import {
  Abi,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  AbiStateMutability,
  ExtractAbiEventNames,
  ExtractAbiEvent,
  AbiTypeToPrimitiveType,
  AbiType,
} from "abitype";

/**
 * A named and typed abi input object
 */
type DetailedAbiInput = { name: string; type: AbiType };

/**
 * Get a primitive object type from a union of named and typed abi input objects
 */
type EventInputToPrimitiveTypes<TInput extends DetailedAbiInput> = {
  [K in TInput["name"]]: AbiTypeToPrimitiveType<
    Extract<TInput, { name: K }>["type"]
  >;
};

/**
 * Get a union of event names from an abi
 */
export type EventName<TAbi extends Abi> = ExtractAbiEventNames<TAbi>;

/**
 * Get a union of named and typed inputs for an event from an abi
 */
type DetailedEventInput<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Extract<
  ExtractAbiEvent<TAbi, TEventName>["inputs"][number],
  DetailedAbiInput
>;

/**
 * Get an object type for an event's fields from an abi
 */
export type EventArgs<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = EventInputToPrimitiveTypes<DetailedEventInput<TAbi, TEventName>>;

/**
 * Get a union of indexed input objects for an event from an abi
 */
type IndexedEventInput<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Extract<DetailedEventInput<TAbi, TEventName>, { indexed: true }>;

/**
 * Get an object type for an event's indexed fields from an abi
 */
export type EventFilter<
  TAbi extends Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = Partial<EventInputToPrimitiveTypes<IndexedEventInput<TAbi, TEventName>>>;

/**
 * Get a union of function names from an abi
 */
export type FunctionName<
  TAbi extends Abi,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = ExtractAbiFunctionNames<TAbi, TAbiStateMutability>;

/**
 * Get an array of argument types for a function from an abi
 */
export type FunctionArgs<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, TFunctionName>["inputs"],
  "inputs"
>;

/**
 * Get the return type of an abi function
 */
export type FunctionReturnType<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, TFunctionName>["outputs"],
  "outputs"
>;
