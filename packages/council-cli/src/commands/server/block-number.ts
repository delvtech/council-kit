import { createDrift } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { rpcUrlOption } from "../../options/rpc-url.js";

export default command({
  description: "Get the block number of the local blockchain",

  options: {
    rpc: rpcUrlOption,
  },

  handler: async ({ options, next }) => {
    const rpcUrl = await options.rpc({
      prompt: "Enter RPC URL",
    });

    const blockNumber = await createDrift({ rpcUrl }).getBlockNumber();

    signale.info(`Current block number: ${blockNumber}`);
    next(blockNumber);
  },
});
