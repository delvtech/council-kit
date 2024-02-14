import { Ballot, ReadWriteCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, createWalletClient, http } from "viem";
import {
  getWriteOptions,
  writeOptions,
} from "../../reusable-options/writeOptions.js";

export default command({
  description: "Vote on a proposal",

  options: {
    address: {
      description: "The voting contract address",
      type: "string",
      required: true,
    },
    id: {
      alias: ["proposal-id"],
      description: "The proposal id",
      type: "number",
      required: true,
    },
    ballot: {
      description:
        "The initial vote from the signer's account (yes, no, maybe).",
      type: "string",
      default: "yes",
    },
    vaults: {
      description:
        "The addresses of the approved voting vaults to draw voting power from.",
      type: "array",
      string: true,
      required: true,
    },
    vaultdatas: {
      alias: ["vault-data", "extra-vault-data"],
      description: "The extra data for each vault",
      type: "array",
      string: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, context, next }) => {
    const { account, chain, rpcUrl } = await getWriteOptions(options, context);

    const address = await options.address({
      prompt: "Enter voting contract address",
    });

    const id = await options.id({
      prompt: "Enter proposal id",
    });

    const ballot = await options.ballot({
      prompt: {
        message: "Select initial ballot",
        type: "select",
        choices: [
          {
            title: "Yes",
            value: "yes",
          },
          {
            title: "No",
            value: "no",
          },
          {
            title: "Abstain",
            value: "maybe",
          },
        ],
      },
      validate: (value) => {
        if (value === "yes" || value === "no" || value === "maybe") {
          return true;
        }
        return false;
      },
    });

    const vaults = await options.vaults({
      prompt: "Enter voting vault addresses",
    });

    const vaultdatas = await options.vaultdatas();

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ transport, chain });
    const walletClient = createWalletClient({ transport, chain, account });

    const council = new ReadWriteCouncil({ publicClient, walletClient });
    const coreVoting = council.coreVoting({
      address: address as `0x${string}`,
    });

    const propsal = await coreVoting.getProposal({ id: BigInt(id) });
    const hash = await propsal?.vote({
      ballot: ballot as Ballot,
      vaults: vaults as `0x${string}`[],
      extraVaultData: vaultdatas as `0x${string}`[] | undefined,
    });

    signale.success(hash);
    next(hash);
  },
});
