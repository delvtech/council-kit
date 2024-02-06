import { ViemReadCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, http } from "viem";
import { chainOption, getChain } from "../../reusable-options/chain.js";
import { rpcUrlOption } from "../../reusable-options/rpc-url.js";

export default command({
  description: "Get the delegate of a given account.",

  options: {
    address: {
      description: "The LockingVault contract address",
      type: "string",
      required: true,
    },
    account: {
      alias: ["voter"],
      description: "The account to get the delegate of",
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

    const account = await options.account({
      prompt: "Enter account to get delegate of",
    });

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ transport, chain });

    const council = new ViemReadCouncil({ publicClient });
    const lockingVault = council.lockingVault(address as `0x${string}`);

    const delegate = await lockingVault.getDelegate({
      voter: account as `0x${string}`,
    });

    signale.success(delegate.address);
    next(delegate);
  },
});
