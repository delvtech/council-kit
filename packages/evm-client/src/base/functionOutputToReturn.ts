import { Abi, AbiFunction } from "abitype";
import { FunctionName, FunctionOutput, FunctionReturn } from "./abitype";

/**
 * Converts a {@linkcode FunctionOutput} array of into a
 * {@linkcode FunctionReturn}, ensuring the outputs are properly identified.
 *
 * @example
 * const returnValue = functionOutputToReturn({
 *   abi: IERC20.abi,
 *   functionName: "transfer",
 *   output: ["0x123", 123n],
 * }); // -> { _to: "0x123", _value: 123n }
 */
export function functionOutputToReturn<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
>({
  abi,
  functionName,
  output,
}: {
  abi: TAbi;
  functionName: TFunctionName;
  output: FunctionOutput<TAbi, TFunctionName>;
}): FunctionReturn<TAbi, TFunctionName> {
  const functionAbi = abi.find(
    (item) => item.type === "function" && item.name === functionName,
  ) as AbiFunction | undefined;

  if (!functionAbi) {
    throw new Error(`Function ${functionName} not found in abi`);
  }

  const outputs = functionAbi.outputs;
  if (outputs.length === 1) {
    return output[0];
  }

  const returnValue: Record<string, any> = {};
  for (const [i, { name }] of outputs.entries()) {
    if (name) {
      returnValue[name] = output[i];
    } else {
      returnValue[i] = output[i];
    }
  }

  return returnValue as FunctionReturn<TAbi, TFunctionName>;
}
