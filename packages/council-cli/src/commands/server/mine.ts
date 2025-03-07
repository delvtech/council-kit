import { command } from "clide-js";
import signale from "signale";
import { createClient, http } from "viem";
import { mine } from "../../lib/viem.js";
import { rpcUrlOption } from "../../options/rpc-url.js";

export default command({
  description: "Mine blocks on the local blockchain",

  options: {
    blocks: {
      description: "The number of blocks to mine",
      type: "number",
      required: true,
      default: 1,
    },
    rpc: rpcUrlOption,
  },

  handler: async ({ options, next }) => {
    const rpcUrl = await options.rpc({
      prompt: "Enter RPC URL",
    });

    const blocks = await options.blocks({
      prompt: "Enter the number of blocks to mine",
    });

    const client = createClient({
      transport: http(rpcUrl),
    });
    await mine({ blocks, client });

    signale.success(`Mined ${blocks} blocks.`);
    next();
  },
});
