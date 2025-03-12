import { Treasury } from "@delvtech/council-artifacts/Treasury";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for Treasury.genericCall",

  options: {
    t: {
      alias: ["target"],
      description: `The address of the target contract.`,
      type: "string",
      customType: "hex",
      required: true,
    },
    d: {
      alias: ["calldata", "call-data"],
      description: "The encoded call data.",
      type: "string",
      customType: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const target = await options.target({
      prompt: "Enter target address",
    });

    const calldata = await options.calldata({
      prompt: "Enter call data",
    });

    const encoded = encodeFunctionData({
      abi: Treasury.abi,
      fn: "genericCall",
      args: {
        _callData: calldata,
        _target: target,
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
