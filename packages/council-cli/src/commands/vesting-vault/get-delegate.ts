import { createCouncil } from "@delvtech/council-js";
import { command } from "clide-js";
import signale from "signale";
import { rpcUrlOption } from "../../options/rpc-url.js";

export default command({
  description: "Get the delegate of a given account.",

  options: {
    a: {
      alias: ["address"],
      description: "The LockingVault contract address.",
      type: "string",
      customType: "hex",
      required: true,
    },
    v: {
      alias: ["account", "voter"],
      description: "The account to get the delegate of.",
      type: "string",
      customType: "hex",
      required: true,
    },
    rpc: rpcUrlOption,
  },

  handler: async ({ options, next }) => {
    const rpcUrl = await options.rpcUrl({
      prompt: "Enter RPC URL",
    });

    const address = await options.address({
      prompt: "Enter LockingVault contract address",
    });

    const account = await options.voter({
      prompt: "Enter account to get delegate of",
    });

    const delegate = await createCouncil({ rpcUrl })
      .vestingVault(address)
      .getDelegate(account);

    signale.info(delegate);
    next(delegate);
  },
});
