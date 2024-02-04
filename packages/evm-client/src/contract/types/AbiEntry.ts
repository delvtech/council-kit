import {
  Abi,
  AbiItemType,
  AbiParameter,
  AbiParameterKind,
  AbiParametersToPrimitiveTypes,
  AbiParameterToPrimitiveType,
  AbiStateMutability,
} from "abitype";
import { EmptyObject, Prettify } from "src/base/types";

// https://docs.soliditylang.org/en/latest/abi-spec.html#json

export type NamedAbiParameter = AbiParameter & { name: string };

/**
 * Get a union of possible names for an abi item type.
 *
 * @example
 * type Erc20EventNames = AbiEntryName<Erc20Abi, "event">;
 * // -> "Approval" | "Transfer"
 */
export type AbiEntryName<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
> = Extract<TAbi[number], { type: TItemType; name?: string }>["name"];

/**
 * Get the ABI entry for a specific type, name, and state mutability.
 *
 * @example
 * type ApproveEntry = AbiEntry<Erc20Abi, "function", "approve">;
 * // ->
 * // {
 * //   type: "function";
 * //   name: "approve";
 * //   inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }];
 * //   outputs: [{ name: "", type: "bool" }];
 * //   stateMutability: "nonpayable";
 * // }
 */
export type AbiEntry<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType> = AbiEntryName<TAbi, TItemType>,
  TStateMutability extends AbiStateMutability = AbiStateMutability,
> = Extract<
  TAbi[number],
  { type: TItemType; name?: TName; stateMutability?: TStateMutability }
>;

/**
 * Get an array of primitive types for any ABI parameters.
 *
 * @example
 * type ApproveInput = AbiArrayType<Erc20Abi, "function", "approve", "inputs">;
 * // -> [`${string}`, bigint]
 *
 * type BalanceOutput = AbiArrayType<Erc20Abi, "function", "balanceOf", "outputs">;
 * // -> [bigint]
 */
export type AbiArrayType<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType> = AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> =
  AbiEntry<TAbi, TItemType, TName> extends infer TAbiEntry
    ? TParameterKind extends keyof TAbiEntry
      ? TAbiEntry[TParameterKind] extends infer TParameters
        ? TParameters extends readonly AbiParameter[]
          ? AbiParametersToPrimitiveTypes<TParameters>
          : TParameters
        : []
      : []
    : [];

/**
 * Convert an array or tuple of abi parameters to an object type.
 *
 * @example
 * type ApproveArgs = AbiParametersToObject<Erc20Abi, "function", "approve", "inputs">;
 * // -> { spender: `${string}`, value: bigint }
 */
export type AbiParametersToObject<
  TParameters extends readonly AbiParameter[],
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = TParameters extends readonly []
  ? EmptyObject
  : TParameters extends NamedAbiParameter[]
    ? NamedParametersToObject<TParameters, TParameterKind>
    : NamedParametersToObject<WithDefaultNames<TParameters>, TParameterKind>;

/**
 * Get a user-friendly primitive type for any ABI parameters, which is
 * determined by the number of parameters:
 * - __Single parameter:__ the primitive type of the parameter.
 * - __Multiple parameters:__ an object with the parameter names as keys and the
 *   their primitive types as values. If a parameter has no name, it's index is
 *   used as the key.
 * - __No parameters:__ `undefined`.
 *
 * @example
 * type ApproveArgs = AbiFriendlyType<Erc20Abi, "function", "approve", "inputs">;
 * // -> { spender: `${string}`, value: bigint }
 *
 * type Balance = AbiFriendlyType<Erc20Abi, "function", "balanceOf", "outputs">;
 * // -> bigint
 *
 * type DecimalArgs = AbiFriendlyType<Erc20Abi, "function", "decimals", "inputs">;
 * // -> undefined
 */
export type AbiFriendlyType<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType> = AbiEntryName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind = AbiParameterKind,
  TStateMutability extends AbiStateMutability = AbiStateMutability,
> =
  AbiEntry<TAbi, TItemType, TName, TStateMutability> extends infer TAbiEntry
    ? TParameterKind extends keyof TAbiEntry & AbiParameterKind // Check if the ABI entry includes the parameter kind (inputs/outputs)
      ? TAbiEntry[TParameterKind] extends readonly [AbiParameter] // Check if it's a single parameter
        ? AbiParameterToPrimitiveType<
            TAbiEntry[TParameterKind][0],
            TParameterKind
          > // Single parameter type
        : TAbiEntry[TParameterKind] extends readonly [
              AbiParameter,
              ...AbiParameter[],
            ] // Check if it's multiple parameters
          ? AbiParametersToObject<TAbiEntry[TParameterKind], TParameterKind> // Multiple parameters type
          : undefined // Empty parameters
      : undefined // ABI entry doesn't include the parameter kind (inputs/outputs)
    : undefined; // ABI entry not found

/**
 * Add default names to any ABI parameters that are missing a name. The default
 * name is the index of the parameter.
 */
type WithDefaultNames<TParameters extends readonly AbiParameter[]> = {
  [K in keyof TParameters]: TParameters[K] extends infer TParameter extends
    AbiParameter
    ? TParameter extends NamedAbiParameter
      ? TParameter
      : TParameter & { name: `${K}` }
    : never;
};

/**
 * Convert an array or tuple of named abi parameters to an object type. The keys
 */
type NamedParametersToObject<
  TParameters extends readonly NamedAbiParameter[],
  TParameterKind extends AbiParameterKind = AbiParameterKind,
> = Prettify<
  // <- Combine all the keys into a single object
  {
    // For every parameter name, excluding empty names, add a key to the object
    // for the parameter name
    [TName in Exclude<
      TParameters[number]["name"],
      ""
    >]: AbiParameterToPrimitiveType<
      Extract<TParameters[number], { name: TName }>,
      TParameterKind
    >;
    // Check if the parameters are in a Tuple. Tuples have known indexes, so we
    // can use the index as the key for the nameless parameters
  } & (TParameters extends readonly [NamedAbiParameter, ...NamedAbiParameter[]]
    ? {
        // For every key on the parameters type, if it's value is a parameter
        // and the parameter's name is empty (""), then add a key for the index
        [K in keyof TParameters as TParameters[K] extends NamedAbiParameter
          ? TParameters[K]["name"] extends ""
            ? // Exclude `number` to ensure only the specific index keys are
              // included and not `number` itself
              Exclude<K, number>
            : never // <- Prototype key (e.g., `length`, `toString`)
          : never]: TParameters[K] extends NamedAbiParameter
          ? AbiParameterToPrimitiveType<TParameters[K], TParameterKind>
          : never; // <- Prototype value
      }
    : // If the parameters are not in a Tuple, then we can't use the index as a
      // key, so we have to use `number` as the key for any parameters that have
      // empty names ("") in arrays
      Extract<TParameters[number], { name: "" }> extends never
      ? unknown // <- No parameters with empty names
      : {
          [index: number]: AbiParameterToPrimitiveType<
            Extract<TParameters[number], { name: "" }>,
            "inputs"
          >;
        })
>;
