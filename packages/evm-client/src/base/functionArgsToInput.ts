import { Abi, AbiFunction } from "abitype";
import { FunctionArgs, FunctionInput, FunctionName } from "src/base/abitype";

/**
 * Converts {@linkcode FunctionArgs} to a {@linkcode FunctionInput} array,
 * ensuring that the arguments are in the correct order and that the correct
 * number of arguments are passed to the function.
 *
 * @example
 * const inputArray = functionArgsToInput({
 *   abi: IERC20.abi,
 *   functionName: "transfer",
 *   args: {
 *     _to: "0x123",
 *     _value: 123n,
 *   },
 * }); // -> ["0x123", 123n]
 */
export function functionArgsToInput<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
>({
  abi,
  functionName,
  args,
}: {
  abi: TAbi;
  functionName: TFunctionName;
  args: FunctionArgs<TAbi, TFunctionName>;
}): FunctionInput<TAbi, TFunctionName> {
  const functionAbi = abi.find(
    (item) => item.type === "function" && item.name === functionName,
  ) as AbiFunction | undefined;

  if (!functionAbi) {
    throw new Error(`Function ${functionName} not found in abi`);
  }

  const inputs = functionAbi.inputs;
  if (inputs.length === 1) {
    return [args] as any;
  }

  const tuple = [];
  for (const [i, { name }] of inputs.entries()) {
    if (name) {
      tuple.push((args as any)[name]);
    } else {
      tuple.push((args as any)[i]);
    }
  }

  return tuple as any;
}
