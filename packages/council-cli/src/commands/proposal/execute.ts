import { ViemReadWriteCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, createWalletClient, http } from "viem";
import {
  getWriteOptions,
  writeOptions,
} from "../../reusable-options/write-options.js";

export default command({
  description: "Execute a proposal",

  options: {
    a: {
      alias: ["address"],
      description: "The voting contract address",
      type: "string",
      required: true,
    },
    p: {
      alias: ["id"],
      description: "The id of the proposal to execute",
      type: "number",
      required: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, end, next }) => {
    const { account, chain, rpcUrl } = await getWriteOptions(options);

    const address = await options.address({
      prompt: "Enter voting contract address",
    });

    const id = await options.id({
      prompt: "Enter proposal id",
    });

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ transport, chain });
    const walletClient = createWalletClient({ transport, chain, account });

    const council = new ViemReadWriteCouncil({ publicClient, walletClient });
    const coreVoting = council.coreVoting({
      address: address as `0x${string}`,
    });
    const proposal = await coreVoting.getProposal({ id: BigInt(id) });

    if (!proposal) {
      signale.error(`Proposal ${id} not found`);
      return end();
    }

    const hash = await proposal.execute();

    signale.success(hash);
    next(hash);
  },
});
