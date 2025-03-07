import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseEther } from "viem";

export default command({
  description: "Encode call data for CoreVoting.setMinProposalPower",

  options: {
    p: {
      alias: ["power", "min-proposal-power"],
      description: "The minimum voting power required to create a proposal.",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const power = await options.power({
      prompt: "Enter minimum voting power",
    });

    const encoded = encodeFunctionData({
      abi: CoreVoting.abi,
      fn: "setMinProposalPower",
      args: {
        _minProposalPower: parseEther(power),
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
