import {
  Abi,
  AbiItemType,
  AbiParameter,
  AbiParameterKind,
  AbiParametersToPrimitiveTypes,
  AbiParameterToPrimitiveType,
  AbiStateMutability,
} from "abitype";
import { EmptyObject } from "src/base/types";

//https://docs.soliditylang.org/en/latest/abi-spec.html#json

export type NamedAbiParameter = AbiParameter & { name: string };

/**
 * Get a union of possible names for an abi item type.
 */
export type AbiEntryName<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
> = Extract<TAbi[number], { type: TItemType; name?: string }>["name"];

/**
 * Get the ABI entry for a specific type, name, and state mutability.
 */
export type AbiEntry<
  TAbi extends Abi,
  TItemType extends AbiItemType = AbiItemType,
  TName extends
    | (AbiEntryName<TAbi, TItemType> extends string
        ? AbiEntryName<TAbi, TItemType>
        : string)
    | undefined = string,
  TStateMutability extends AbiStateMutability = AbiStateMutability,
> = Extract<
  TAbi[number],
  { type: TItemType; name?: TName; stateMutability?: TStateMutability }
>;

/**
 * Get an array of primitive types for any ABI parameters.
 *
 * @example
 *
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
 * Convert an array or tuple of named abi parameters to an object type.
 */
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
 * Convert an array or tuple of abi parameters to an object type.
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
 *
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
    ? TParameterKind extends keyof TAbiEntry & AbiParameterKind
      ? TAbiEntry[TParameterKind] extends readonly [AbiParameter]
        ? AbiParameterToPrimitiveType<
            TAbiEntry[TParameterKind][0],
            TParameterKind
          >
        : TAbiEntry[TParameterKind] extends readonly [
              AbiParameter,
              ...AbiParameter[],
            ]
          ? AbiParametersToObject<TAbiEntry[TParameterKind], TParameterKind>
          : undefined
      : undefined
    : undefined;
