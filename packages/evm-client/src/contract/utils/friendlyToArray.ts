import { Abi, AbiItemType, AbiParameter, AbiParameterKind } from "abitype";
import {
  AbiArrayType,
  AbiEntryName,
  AbiFriendlyType,
} from "src/contract/AbiEntry";
import { FunctionName } from "src/contract/Function";
import { getAbiEntry } from "src/contract/utils/getAbiItem";

/**
 * Converts an array of input or output values into a {@linkcode AbiFriendlyType},
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
 * const parsedArgs = friendlyToArray({
 *   abi,
 *   type: "function",
 *   name: "transfer",
 *   kind: "inputs",
 *   value: { value: 123n, to: "0x123" },
 * }); // -> ["0x123", 123n]
 *
 * const parsedReturn = friendlyToArray({
 *   abi,
 *   type: "function",
 *   name: "transfer",
 *   kind: "outputs",
 *   value: true,
 * }); // -> [true]
 */
export function friendlyToArray<
  TAbi extends Abi,
  TItemType extends AbiItemType,
  TName extends AbiEntryName<TAbi, TItemType> & FunctionName<TAbi>,
  TParameterKind extends AbiParameterKind,
>({
  abi,
  type,
  name,
  kind,
  value: _value,
}: {
  abi: TAbi;
  name: TName;
  value: AbiFriendlyType<TAbi, TItemType, TName, TParameterKind>;
  kind: TParameterKind;
  type: TItemType;
}): AbiArrayType<TAbi, TItemType, TName, TParameterKind> {
  const value = _value as any;
  const abiEntry = getAbiEntry({ abi, type, name });

  let parameters: AbiParameter[] = [];
  if (kind in abiEntry) {
    parameters = (abiEntry as any)[kind];
  }

  // Single or no parameters
  if (parameters.length <= 1) {
    return [] as AbiArrayType<TAbi, TItemType, TName, TParameterKind>;
  }

  const array: any[] = [];
  parameters.forEach(({ name }, i) => {
    array.push(value[name ?? i]);
  });

  return array as AbiArrayType<TAbi, TItemType, TName, TParameterKind>;
}
