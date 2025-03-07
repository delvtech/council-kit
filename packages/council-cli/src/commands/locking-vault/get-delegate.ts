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
      type: "hex",
      required: true,
    },
    v: {
      alias: ["voter", "account"],
      description: "The account to get the delegate of.",
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
      prompt: "Enter LockingVault contract address",
    });

    const account = await options.account({
      prompt: "Enter account to get delegate of",
    });

    const delegate = await createCouncil({ rpcUrl })
      .lockingVault(address)
      .getDelegate(account);

    signale.info(delegate);
    next(delegate);
  },
});
