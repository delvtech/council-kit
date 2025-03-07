import { createCouncil } from "@delvtech/council-js";
import { command } from "clide-js";
import signale from "signale";
import { rpcUrlOption } from "../../options/rpc-url.js";

export default command({
  description: "Get the token contract address of a given locking vault.",

  options: {
    a: {
      alias: ["address"],
      description: "The LockingVault contract address",
      type: "hex",
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

    const token = await createCouncil({ rpcUrl })
      .vestingVault(address)
      .getToken();

    signale.info(token.address);
    next(token);
  },
});
