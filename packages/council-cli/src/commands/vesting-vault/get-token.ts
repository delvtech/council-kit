import { ReadCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, http } from "viem";
import { chainOption, getChain } from "../../reusable-options/chain.js";
import { rpcUrlOption } from "../../reusable-options/rpc-url.js";

export default command({
  description: "Get the token contract address of a given locking vault.",

  options: {
    address: {
      description: "The LockingVault contract address",
      type: "string",
      required: true,
    },
    chain: chainOption,
    rpc: rpcUrlOption,
  },

  handler: async ({ options, context, next }) => {
    const chain = await getChain(options.chain, context);

    const rpcUrl = await options.rpc({
      prompt: "Enter RPC URL",
    });

    const address = await options.address({
      prompt: "Enter LockingVault contract address",
    });

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ transport, chain });

    const council = new ReadCouncil({ publicClient });
    const lockingVault = council.lockingVault(address as `0x${string}`);

    const token = await lockingVault.getToken();

    signale.info(token.address);
    next(token);
  },
});
