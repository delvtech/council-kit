import { Ballot, ReadWriteCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, createWalletClient, http } from "viem";
import {
  getWriteOptions,
  writeOptions,
} from "../../reusable-options/writeOptions.js";
import { DAY_IN_BLOCKS } from "../../utils/constants.js";

export default command({
  description: "Create a proposal",

  options: {
    address: {
      description: "The voting contract address",
      type: "string",
      required: true,
    },
    vaults: {
      description:
        "The addresses of the approved voting vaults to draw voting power from. This will be used to verify that the signer has enough voting power to create a proposal.",
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
    targets: {
      description: "A list of addresses to call.",
      type: "array",
      string: true,
      required: true,
    },
    calldatas: {
      alias: ["data", "call-data"],
      description: "Encoded call data for each target.",
      type: "array",
      string: true,
      required: true,
    },
    "last-call": {
      description:
        "The block after which the proposal can no longer be executed.",
      type: "number",
      required: true,
    },
    ballot: {
      description:
        "The initial vote from the signer's account (yes, no, maybe).",
      type: "string",
      default: "yes",
    },
    ...writeOptions,
  },

  handler: async ({ options, context, next }) => {
    const { account, chain, rpcUrl } = await getWriteOptions(options, context);

    const address = await options.address({
      prompt: "Enter voting contract address",
    });

    const vaults = await options.vaults({
      prompt: "Enter voting vault addresses",
    });

    const vaultdatas = await options.vaultdatas();

    const targets = await options.targets({
      prompt: "Enter target addresses",
    });

    const calldatas = await options.calldatas({
      prompt: "Enter call data for each target",
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

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ transport, chain });
    const walletClient = createWalletClient({ transport, chain, account });
    const currentBlock = await publicClient.getBlockNumber();

    const lastCall = await options.lastCall({
      prompt: {
        message: "Enter the last call block",
        initial: String(currentBlock + DAY_IN_BLOCKS * 14n),
        validate: (value) => {
          return !isNaN(Number(value));
        },
      },
    });

    const council = new ReadWriteCouncil({ publicClient, walletClient });
    const coreVoting = council.coreVoting({
      address: address as `0x${string}`,
    });

    const hash = await coreVoting.createProposal({
      ballot: ballot as Ballot,
      calldatas: calldatas as `0x${string}`[],
      lastCall: BigInt(lastCall),
      targets: targets as `0x${string}`[],
      vaults: vaults as `0x${string}`[],
      extraVaultData:
        (vaultdatas as `0x${string}`[] | undefined) || vaults.map(() => "0x"),
    });

    signale.success(hash);
    next(hash);
  },
});
