import { Ballot } from "@delvtech/council-js";
import { Address, Bytes } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { getWriteOptions, writeOptions } from "../../options/writeOptions.js";

export default command({
  description: "Vote on a proposal",

  options: {
    a: {
      alias: ["address"],
      description: "The voting contract address",
      type: "string",
      customType: "hex",
      required: true,
    },
    p: {
      alias: ["proposal", "id"],
      description: "The id of the proposal",
      type: "number",
      required: true,
    },
    b: {
      alias: ["ballot"],
      description: "The ballot to cast.",
      type: "string",
      default: "yes",
      choices: ["yes", "no", "maybe"],
    },
    v: {
      alias: ["vaults"],
      description:
        "The addresses of the approved voting vaults to draw voting power from.",
      type: "array",
      string: true,
      required: true,
    },
    d: {
      alias: ["vault-data", "extra-vault-data"],
      description: "The extra data for each vault",
      type: "array",
      string: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, client, next }) => {
    const { drift, council } = await getWriteOptions(options, client);

    const address = await options.address({
      prompt: "Enter voting contract address",
    });

    const proposalId = await options.id({
      prompt: "Enter proposal id",
    });

    const ballot = await options.ballot({
      prompt: "Select a ballot to cast",
    });

    const vaults = await options.vaults({
      prompt: "Enter voting vault addresses",
    });

    const extraData = await options.extraVaultData();

    const hash = await council.coreVoting(address).vote({
      args: {
        ballot: ballot as Ballot,
        proposalId: BigInt(proposalId),
        vaults: vaults as Address[],
        extraVaultData: extraData as Bytes[] | undefined,
      },
      options: {
        onMined: () => {
          signale.success(`Transaction success: ${hash}`);
        },
      },
    });

    signale.pending(`Transaction submitted: ${hash}`);
    await drift.waitForTransaction({ hash });
    next(hash);
  },
});
