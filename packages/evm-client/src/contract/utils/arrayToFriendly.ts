import { Abi, AbiItemType, AbiParameter, AbiParameterKind } from "abitype";
import {
  AbiArrayType,
  AbiEntryName,
  AbiFriendlyType,
} from "src/contract/types/AbiEntry";
import { FunctionName } from "src/contract/types/Function";
import { getAbiEntry } from "src/contract/utils/getAbiEntry";

/**
 * Converts an array of input or output values into an
 * {@linkcode AbiFriendlyType}, ensuring the values are properly identified
 * based on their index.
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
  TName extends AbiEntryName<TAbi, TItemType> & FunctionName<TAbi>,
  TParameterKind extends AbiParameterKind,
>({
  abi,
  type,
  name,
  kind,
  values,
}: {
  abi: TAbi;
  name: TName;
  values: AbiArrayType<TAbi, TItemType, TName, TParameterKind>;
  kind: TParameterKind;
  type: TItemType;
}): AbiFriendlyType<TAbi, TItemType, TName, TParameterKind> {
  const abiEntry = getAbiEntry({ abi, type, name });

  let parameters: AbiParameter[] = [];
  if (kind in abiEntry) {
    parameters = (abiEntry as any)[kind];
  }

  // Single or no parameters
  if (parameters.length <= 1) {
    return (values as any[])[0];
  }

  const friendlyValue: Record<string, any> = {};
  parameters.forEach(({ name }, i) => {
    if (name) {
      friendlyValue[name] = values[i];
    } else {
      friendlyValue[i] = values[i];
    }
  });

  return friendlyValue as any;
}
