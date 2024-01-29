import {
  Abi,
  AbiParameter,
  AbiParameterKind,
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
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = {
  [K in TParameters[number]["name"]]: AbiParameterToPrimitiveType<
    Extract<TParameters[number], { name: K }>,
    TParameterKind
  >;
};

type ParametersToInterface<
  TParameters extends readonly AbiParameter[],
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = TParameters extends readonly []
  ? EmptyObject
  : TParameters extends NamedAbiParameter[]
    ? NamedParametersToInterface<TParameters, TParameterKind>
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
          ? AbiParameterToPrimitiveType<TParameters[K], TParameterKind>
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
> = NamedParametersToInterface<NamedEventInput<TAbi, TEventName>[], "inputs">;

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
  NamedParametersToInterface<IndexedEventInput<TAbi, TEventName>[], "inputs">
>;

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
  TFunctionName extends FunctionName<TAbi>,
> = ExtractAbiFunction<
  TAbi,
  TFunctionName
>["inputs"] extends infer TInputs extends readonly AbiParameter[]
  ? TInputs extends readonly [AbiParameter]
    ? AbiParameterToPrimitiveType<TInputs[0], "inputs">
    : ParametersToInterface<TInputs, "outputs">
  : never;

/**
 * Get an array of function arguments from an abi function.
 */
export type FunctionInput<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> =
  AbiParametersToPrimitiveTypes<
    ExtractAbiFunction<TAbi, TFunctionName>["inputs"],
    "inputs"
  > extends infer TTuple extends readonly any[]
    ? TTuple
    : readonly unknown[];

/**
 * Get the return type of an abi function, which is determined by it's outputs:
 * - __Single output:__ the type of the single output.
 * - __Multiple outputs:__ an object with the output names as keys and the output types as values.
 * - __No outputs:__ `void`.
 */
export type FunctionReturn<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> = ExtractAbiFunction<
  TAbi,
  TFunctionName
>["outputs"] extends infer TOuputs extends readonly [
  AbiParameter,
  ...AbiParameter[],
]
  ? TOuputs extends readonly [AbiParameter]
    ? AbiParameterToPrimitiveType<TOuputs[0], "outputs">
    : ParametersToInterface<TOuputs, "outputs">
  : void;

/**
 *
 */
export type FunctionOutput<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> =
  AbiParametersToPrimitiveTypes<
    ExtractAbiFunction<TAbi, TFunctionName>["inputs"],
    "inputs"
  > extends infer TTuple extends readonly any[]
    ? TTuple
    : readonly unknown[];
