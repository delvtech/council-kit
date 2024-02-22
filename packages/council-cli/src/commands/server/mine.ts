import { command } from "clide-js";
import signale from "signale";
import { Client, createClient, http } from "viem";
import { rpcUrlOption } from "../../reusable-options/rpc-url.js";

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

interface MineOptions {
  blocks: number;
  client: Client;
}

/**
 * Mine a given number of blocks on the local testnet
 * @param blocks The number of blocks to mine
 * @returns The new current block number
 */
export async function mine({ blocks, client }: MineOptions): Promise<void> {
  await client.request({
    // @ts-expect-error - This is a hardhat method
    method: "hardhat_mine",
    params: [`0x${blocks.toString(16)}`],
  });
}
