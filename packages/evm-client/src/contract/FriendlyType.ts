import {
  Abi,
  AbiItemType,
  AbiParameter,
  AbiParameterKind,
  AbiParameterToPrimitiveType,
} from "abitype";
import {
  AbiArrayType,
  AbiItemName,
  AbiParametersToObject,
  SubAbi,
} from "src/base/abitype";

/**
 * Converts an array of input or output values into a {@linkcode FriendlyType},
 * ensuring the values are properly identified based on their index.
 *
 * @example
 * const abi = [
 *   {
 *     type: "function",
 *     name: "transfer",
 *     inputs: [
 *       { name: "to", type: "address" },
 *       { name: "value", type: "uint256" },
 *     ],
 *     outputs: [{ name: "", type: "bool" }],
 *     stateMutability: "nonpayable",
 *   },
 * ] as const;
 *
 * const parsedArgs = arrayToFriendly({
 *   abi,
 *   type: "function",
 *   name: "transfer",
 *   kind: "inputs",
 *   values: ["0x123", 123n],
 * }); // -> { to: "0x123", value: 123n }
 *
 * const parsedReturn = arrayToFriendly({
 *   abi,
 *   type: "function",
 *   name: "transfer",
 *   kind: "outputs",
 *   values: [true],
 * }); // -> true
 */
export function arrayToFriendly<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiItemName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind,
>({
  abi,
  type,
  name,
  kind,
  values: _values,
}: {
  abi: TAbi;
  name: TName;
  values: AbiArrayType<TAbi, TItemType, TName, TParameterKind>;
  kind: TParameterKind;
  type: TItemType;
}): FriendlyType<TAbi, TItemType, TName, TParameterKind> {
  const values = _values as any[];
  const abiItem = getAbiItem({ abi, type, name });

  let parameters: AbiParameter[] = [];
  if (kind in abiItem) {
    parameters = (abiItem as any)[kind];
  }

  // Single or no parameters
  if (parameters.length <= 1) {
    return values[0];
  }

  const friendlyType: Record<string, any> = {};
  parameters.forEach(({ name }, i) => {
    if (name) {
      friendlyType[name] = values[i];
    } else {
      friendlyType[i] = values[i];
    }
  });

  return friendlyType as any;
}

/**
 * Converts a {@linkcode FriendlyType} into an array of input or output values,
 * ensuring the values are in the correct order and there are the correct number
 * of values.
 *
 * @example
 * const abi = [
 *   {
 *     type: "function",
 *     name: "transfer",
 *     inputs: [
 *       { name: "to", type: "address" },
 *       { name: "value", type: "uint256" },
 *     ],
 *     outputs: [{ name: "", type: "bool" }],
 *     stateMutability: "nonpayable",
 *   },
 * ] as const;
 *
 * const args = friendlyToArray({
 *   abi,
 *   type: "function",
 *   name: "transfer",
 *   kind: "inputs",
 *   values: { value: 123n, to: "0x123" },
 * }); // -> ["0x123", 123n]
 *
 * const returnValues = friendlyToArray({
 *   abi,
 *   type: "function",
 *   name: "transfer",
 *   kind: "outputs",
 *   values: true,
 * }); // -> [true]
 */
export function friendlyToArray<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiItemName<TAbi, TItemType>,
  TParameterKind extends AbiParameterKind,
>({
  abi,
  type,
  name,
  kind,
  values: _values,
}: {
  abi: TAbi;
  name: TName;
  values: FriendlyType<TAbi, TItemType, TName, TParameterKind>;
  kind: TParameterKind;
  type: TItemType;
}): AbiArrayType<TAbi, TItemType, TName, TParameterKind> {
  const values = _values as any;
  const abiItem = getAbiItem({ abi, type, name });

  let parameters: AbiParameter[] = [];
  if (kind in abiItem) {
    parameters = (abiItem as any)[kind];
  }

  // Single or no parameters
  if (parameters.length <= 1) {
    return [] as AbiArrayType<TAbi, TItemType, TName, TParameterKind>;
  }

  return parameters.map(({ name }, i) => values[name ?? i]) as any;
}

/**
 * Get an ABI item from the ABI by type and name.
 * @throws If the item is not found in the ABI.
 */
function getAbiItem<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiItemName<TAbi, TItemType>,
>({
  abi,
  type,
  name,
}: {
  abi: TAbi;
  type: TItemType;
  name: TName;
}): SubAbi<TAbi, TItemType, TName> {
  const abiItem = abi.find(
    (item) =>
      item.type === type &&
      (type === "constructor" || (item as any).name === name),
  ) as any;

  if (!abiItem) {
    throw new Error(`${type}${name ? ` ${name}` : ""} not found in abi`);
  }

  return abiItem;
}

// TODO: For non-parameter types, e.g., "stateMutability", return the type of
// the ABI field itself.
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
 * ```ts
 * type ApproveArgs = FriendlyType<Erc20Abi, "function", "approve", "inputs">;
 * // -> { spender: `${string}`, value: bigint }
 *
 * type Balance = FriendlyType<Erc20Abi, "function", "balanceOf", "outputs">;
 * // -> bigint
 *
 * type DecimalArgs = FriendlyType<Erc20Abi, "function", "decimals", "inputs">;
 * // -> undefined
 *
 * ```
 */
export type FriendlyType<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiItemName<TAbi, TItemType>,
  TParameterKind extends
    | keyof SubAbi<TAbi, TItemType, TName>
    | AbiParameterKind,
> =
  SubAbi<TAbi, TItemType, TName> extends infer TSubAbi
    ? TParameterKind extends keyof TSubAbi & AbiParameterKind
      ? TSubAbi[TParameterKind] extends readonly [AbiParameter]
        ? AbiParameterToPrimitiveType<
            TSubAbi[TParameterKind][0],
            TParameterKind
          >
        : TSubAbi[TParameterKind] extends readonly [
              AbiParameter,
              ...AbiParameter[],
            ]
          ? AbiParametersToObject<TSubAbi[TParameterKind], TParameterKind>
          : undefined
      : undefined
    : never;
