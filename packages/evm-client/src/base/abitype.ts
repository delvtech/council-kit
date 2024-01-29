import {
  Abi,
  AbiParameter,
  AbiParametersToPrimitiveTypes,
  AbiParameterToPrimitiveType,
  AbiStateMutability,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";
import { EmptyObject } from "./types";

type NamedAbiParameter = AbiParameter & { name: string };

// HACK: When all parameters are named, the normal way of creating an interface
// results in an interface whose value types are unions of all parameter types.
// This way of mapping over a union of the parameter names and extracting the
// parameter type by name works around that. Idk how... but trial and error
// says it does.
type NamedParametersToInterface<
  TParameters extends readonly NamedAbiParameter[],
> = {
  [K in TParameters[number]["name"]]: AbiParameterToPrimitiveType<
    Extract<TParameters[number], { name: K }>
  >;
};

type ParametersToInterface<TParameters extends readonly AbiParameter[]> =
  TParameters extends readonly []
    ? EmptyObject
    : TParameters extends NamedAbiParameter[]
      ? NamedParametersToInterface<TParameters>
      : {
          [K in Exclude<
            keyof TParameters,
            number
          > as TParameters[K] extends NamedAbiParameter
            ? TParameters[K]["name"] extends ""
              ? K
              : TParameters[K]["name"]
            : TParameters[K] extends AbiParameter
              ? K
              : never]: TParameters[K] extends AbiParameter
            ? AbiParameterToPrimitiveType<TParameters[K]>
            : never;
        };

/**
 * Get a union of event names from an abi
 */
export type EventName<TAbi extends Abi> = ExtractAbiEventNames<TAbi>;

/**
 * Get a union of named inputs for an event from an abi
 */
type NamedEventInput<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = Extract<
  ExtractAbiEvent<TAbi, TEventName>["inputs"][number],
  NamedAbiParameter
>;

/**
 * Get an object type for an event's fields from an abi
 */
export type EventArgs<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> = NamedParametersToInterface<NamedEventInput<TAbi, TEventName>[]>;

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
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = Partial<NamedParametersToInterface<IndexedEventInput<TAbi, TEventName>[]>>;

/**
 * Get a union of function names from an abi
 */
export type FunctionName<
  TAbi extends Abi,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = ExtractAbiFunctionNames<TAbi, TAbiStateMutability>;

/**
 * Get the argument types for a function from an abi function, which is determined by it's inputs:
 * - __Single input:__ the type of the single input.
 * - __Multiple inputs:__ an object with the input names as keys and the input types as values.
 * - __No inputs:__ an empty object.
 */
export type FunctionArgs<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = ExtractAbiFunction<
  TAbi,
  TFunctionName
>["inputs"] extends infer TInputs extends readonly AbiParameter[]
  ? TInputs extends readonly [AbiParameter]
    ? AbiParameterToPrimitiveType<TInputs[0]>
    : ParametersToInterface<TInputs>
  : never;

/**
 * Get the return type of an abi function, which is determined by it's outputs:
 * - __Single output:__ the type of the single output.
 * - __Multiple outputs:__ a tuple of the output types.
 * - __No outputs:__ `void`.
 */
export type FunctionReturnType<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> =
  AbiParametersToPrimitiveTypes<
    ExtractAbiFunction<TAbi, TFunctionName>["outputs"],
    "outputs"
  > extends readonly [infer TFirst, ...infer TRest]
    ? TRest extends []
      ? TFirst
      : [TFirst, ...TRest]
    : void;
