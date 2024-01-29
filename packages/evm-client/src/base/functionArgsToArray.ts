import {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
} from "abitype";
import { FunctionArgs, FunctionName } from "./abitype";

/**
 * Converts a function's arguments to an array, ensuring that the arguments are
 * in the correct order and that the correct number of arguments are passed to
 * the function.
 *
 * @example
 * const argsTuple = functionArgsToArray({
 *   abi: IERC20.abi,
 *   functionName: "transfer",
 *   args: {
 *     _to: "0x123",
 *     _value: 123n,
 *   },
 * }); // -> ["0x123", 123n]
 */
export function functionArgsToArray<
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
}): FunctionArgsToArray<TAbi, TFunctionName> {
  const functionAbi = abi.find(
    (item) => item.type === "function" && item.name === functionName,
  ) as AbiFunction | undefined;

  if (!functionAbi) {
    throw new Error(`Function ${functionName} not found in abi`);
  }

  const tuple = [];
  const inputs = functionAbi.inputs;

  if (inputs.length === 1) {
    return [args] as any;
  }

  for (const [i, { name }] of inputs.entries()) {
    if (name) {
      tuple.push((args as any)[name]);
    } else {
      tuple.push((args as any)[i]);
    }
  }

  return tuple as any;
}

export type FunctionArgsToArray<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> =
  AbiParametersToPrimitiveTypes<
    ExtractAbiFunction<TAbi, TFunctionName>["inputs"],
    "inputs"
  > extends infer TTuple extends readonly any[]
    ? TTuple
    : readonly unknown[];

// const foo: readonly any[] = functionArgsToArray({
//   abi: [
//     {
//       type: "function",
//       name: "transfer",
//       inputs: [
//         {
//           name: "_to",
//           type: "address",
//         },
//         {
//           name: "_value",
//           type: "uint256",
//         },
//       ],
//       outputs: [],
//       stateMutability: "nonpayable",
//     },
//   ] as const,
//   functionName: "transfer",
//   args: {
//     _to: "0x123",
//     _value: 123n,
//   },
// });

// type Test = AbiParametersToPrimitiveTypes<
//     [
//     ],
//     "inputs"
//   >
