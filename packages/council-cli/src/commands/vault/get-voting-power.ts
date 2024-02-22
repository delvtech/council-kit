import { ReadCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, http } from "viem";
import { chainOption, getChain } from "../../reusable-options/chain.js";
import { rpcUrlOption } from "../../reusable-options/rpc-url.js";

export default command({
  description: "Get the voting power of a given account.",

  options: {
    address: {
      description: "The vault contract address",
      type: "string",
      required: true,
    },
    account: {
      alias: ["voter"],
      description: "The account to get the voting power of",
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
      prompt: "Enter vault contract address",
    });

    const account = await options.account({
      prompt: "Enter account to get voting power of",
    });

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ transport, chain });

    const council = new ReadCouncil({ publicClient });
    const votingVault = council.votingVault(address as `0x${string}`);

    const votingPower = await votingVault.getVotingPower({
      account: account as `0x${string}`,
    });

    signale.success(votingPower);
    next(votingPower);
  },
});
