import { createCouncil } from "@delvtech/council-js";
import { command } from "clide-js";
import signale from "signale";
import { rpcUrlOption } from "../../options/rpc-url.js";

export default command({
  description: "Get the voting power of a given account.",

  options: {
    a: {
      alias: ["address"],
      description: "The vault contract address.",
      type: "hex",
      required: true,
    },
    v: {
      alias: ["voter", "account"],
      description: "The account to get the voting power of.",
      type: "hex",
      required: true,
    },
    r: rpcUrlOption,
  },

  handler: async ({ options, next }) => {
    const rpcUrl = await options.rpcUrl({
      prompt: "Enter RPC URL",
    });

    const address = await options.address({
      prompt: "Enter vault contract address",
    });

    const voter = await options.voter({
      prompt: "Enter account to get voting power of",
    });

    const votingPower = await createCouncil({ rpcUrl })
      .votingVault(address)
      .getVotingPower({ voter });

    signale.success(votingPower);
    next(votingPower);
  },
});
