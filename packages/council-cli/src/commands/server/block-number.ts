import { command } from "clide-js";
import signale from "signale";
import { createClient, http } from "viem";
import { rpcUrlOption } from "../../reusable-options/rpc-url.js";

export default command({
  description: "Get the block number of the local blockchain",

  options: {
    rpc: rpcUrlOption,
  },

  handler: async ({ options, next }) => {
    const rpcUrl = await options.rpc({
      prompt: "Enter RPC URL",
    });

    const client = createClient({
      transport: http(rpcUrl),
    });

    const blockNumberHex = await client.request({
      method: "eth_blockNumber",
    });
    const blockNumber = BigInt(blockNumberHex);

    signale.info(`Current block number: ${blockNumber}`);
    next(blockNumber);
  },
});
