import {
  Abi,
  AbiItemType,
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

// HACK: When all parameters are named, the normal way of creating an object
// results in an object whose value types are unions of all parameter types.
// This way of mapping over a union of the parameter names and extracting the
// parameter type by name works around that. Idk how... but trial and error
// says it does.
type NamedParametersToObject<
  TParameters extends readonly NamedAbiParameter[],
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = {
  [K in TParameters[number]["name"]]: AbiParameterToPrimitiveType<
    Extract<TParameters[number], { name: K }>,
    TParameterKind
  >;
};

/**
 * Convert an array of abi parameters to an object type.
 */
export type AbiParametersToObject<
  TParameters extends readonly AbiParameter[],
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = TParameters extends readonly []
  ? EmptyObject
  : TParameters extends NamedAbiParameter[]
    ? NamedParametersToObject<TParameters, TParameterKind>
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
> = AbiParametersToObject<ExtractAbiEvent<TAbi, TEventName>["inputs"]>;

// TODO: Ensure utils can deep convert between arrays and objects in cases like
// the CoreVoting.Voted event:
// type FooArgs = EventArgs<typeof CoreVoting.abi, "Voted">
// // -> {
//   voter: `0x${string}`;
//   proposalId: bigint;
//   vote: {
//       votingPower: bigint;
//       castBallot: number;
//   };
// }
// type FooArgs = EventArgs<typeof CoreVoting.abi, "Voted">;

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
 * Get a union of function names from an abi
 */
export type FunctionName<
  TAbi extends Abi,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = ExtractAbiFunctionNames<TAbi, TAbiStateMutability>;

/**
 * Get a union of possible names for an abi item type.
 */
export type AbiItemName<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
> = TAbi extends readonly (
  | {
      name: infer TName;
      type: TItemType;
    }
  | AbiParameter
)[]
  ? TName
  : string;

/**
 * Get an entry from an abi for a specified type and name.
 */
export type SubAbi<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends string,
> = Extract<
  TAbi[number],
  TItemType extends "constructor"
    ? { type: TItemType }
    : { type: TItemType; name: TName }
>;

/**
 * Get an array of primitive types for any ABI parameters.
 *
 * @example
 * ```ts
 * type ApproveInput = ArrayType<Erc20Abi, "function", "approve", "inputs">;
 * // -> [`${string}`, bigint]
 *
 * type BalanceOutput = ArrayType<Erc20Abi, "function", "balanceOf", "outputs">;
 * // -> [bigint]
 *
 * ```
 */
export type AbiArrayType<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiItemName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind,
> =
  SubAbi<TAbi, TItemType, TName> extends infer TSubAbi
    ? TParameterKind extends keyof TSubAbi
      ? TSubAbi[TParameterKind] extends infer TParameters
        ? TParameters extends readonly AbiParameter[]
          ? AbiParametersToPrimitiveTypes<TParameters>
          : TParameters
        : never
      : // ABI doesn't include the specified kind, e.g. "inputs" or "outputs"
        []
    : never;

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
    : AbiParametersToObject<TInputs, "outputs">
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
>["outputs"] extends infer TOutputs extends readonly [
  AbiParameter,
  ...AbiParameter[],
]
  ? TOutputs extends readonly [AbiParameter]
    ? AbiParameterToPrimitiveType<TOutputs[0], "outputs">
    : AbiParametersToObject<TOutputs, "outputs">
  : void;

/**
 * Get an array of ABI function input or output types from an abi function.
 */
export type FunctionValues<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
  TKind extends AbiParameterKind = AbiParameterKind,
> =
  AbiParametersToPrimitiveTypes<
    ExtractAbiFunction<TAbi, TFunctionName>[TKind],
    TKind
  > extends infer TTuple extends readonly any[]
    ? TTuple
    : readonly unknown[];

/**
 * Get an object representing decoded function data for a specified function
 * name.
 */
export type DecodedFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = {
  [K in TFunctionName]: {
    args: FunctionArgs<TAbi, K>;
    functionName: K;
  };
}[TFunctionName];
