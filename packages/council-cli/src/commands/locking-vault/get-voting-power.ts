import { createCouncil } from "@delvtech/council-js";
import { fixed } from "@delvtech/fixed-point-wasm";
import { command } from "clide-js";
import signale from "signale";
import { rpcUrlOption } from "../../options/rpc-url.js";

export default command({
  description: "Get the voting power of a given account.",

  options: {
    a: {
      alias: ["address"],
      description: "The LockingVault contract address",
      type: "string",
      customType: "hex",
      required: true,
    },
    v: {
      alias: ["voter", "account"],
      description: "The account to get the voting power of",
      type: "string",
      customType: "hex",
      required: true,
    },
    r: rpcUrlOption,
  },

  handler: async ({ options, next }) => {
    const rpcUrl = await options.rpcUrl({
      prompt: "Enter RPC URL",
    });

    const address = await options.address({
      prompt: "Enter LockingVault contract address",
    });

    const voter = await options.voter({
      prompt: "Enter account to get balance of",
    });

    const council = createCouncil({ rpcUrl });
    const lockingVault = council.lockingVault(address);
    const power = await lockingVault.getVotingPower({ voter });
    const formattedPower = fixed(power, 18).format();

    signale.info(formattedPower);
    next(power);
  },
});
