import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseEther } from "viem";

export default command({
  description: "Encode call data for CoreVoting.setCustomQuorum",

  options: {
    t: {
      alias: ["target"],
      description: "The address to set a custom quorum for",
      type: "hex",
      required: true,
    },
    f: {
      alias: ["function", "selector"],
      description: "The 4 byte function selector to set a custom quorum for",
      type: "hex",
      required: true,
    },
    q: {
      alias: ["quorum"],
      description:
        "A new base quorum for the specific function (e.g. 0x12345678)",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const target = await options.target({
      prompt: "Enter target address",
    });

    const selector = await options.selector({
      prompt: "Enter 4 byte function selector",
    });

    const quorum = await options.quorum({
      prompt: "Enter new base quorum",
    });

    const encoded = encodeFunctionData({
      abi: CoreVoting.abi,
      fn: "setCustomQuorum",
      args: {
        target,
        selector,
        quorum: parseEther(quorum),
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
