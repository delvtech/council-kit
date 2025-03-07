import { command } from "clide-js";
import signale from "signale";
import { getWriteOptions, writeOptions } from "../../options/writeOptions.js";

export default command({
  description: "Execute a proposal",

  options: {
    a: {
      alias: ["address"],
      description: "The voting contract address",
      type: "hex",
      required: true,
    },
    p: {
      alias: ["proposal", "id"],
      description: "The id of the proposal to execute",
      type: "number",
      required: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, client, next }) => {
    const { council } = await getWriteOptions(options, client);

    const address = await options.address({
      prompt: "Enter voting contract address",
    });

    const id = await options.id({
      prompt: "Enter proposal id",
    });

    const hash = await council.coreVoting(address).executeProposal({
      args: {
        proposalId: BigInt(id),
      },
      options: {
        onMined: () => {
          signale.success(`Transaction success: ${hash}`);
        },
      },
    });

    signale.pending(`Transaction submitted: ${hash}`);
    next(hash);
  },
});
