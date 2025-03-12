import { Ballot } from "@delvtech/council-js";
import { command } from "clide-js";
import signale from "signale";
import { getWriteOptions, writeOptions } from "../../options/writeOptions.js";
import { DAY_IN_BLOCKS } from "../../utils/constants.js";

export default command({
  description: "Create a proposal",

  options: {
    a: {
      alias: ["address"],
      description: "The voting contract address",
      type: "string",
      customType: "hex",
      required: true,
    },
    t: {
      alias: ["targets"],
      description: "A list of addresses to call.",
      type: "array",
      customType: "hexArray",
      string: true,
      required: true,
    },
    d: {
      alias: ["data", "calldatas"],
      description: "Encoded call data for each target.",
      type: "array",
      customType: "hexArray",
      string: true,
      required: true,
    },
    v: {
      alias: ["vaults"],
      description:
        "The addresses of the approved voting vaults to draw voting power from. This will be used to verify that the signer has enough voting power to create a proposal.",
      type: "array",
      customType: "hexArray",
      string: true,
      required: true,
    },
    D: {
      alias: ["vault-data", "extra-vault-data"],
      description: "The extra data for each vault.",
      type: "array",
      customType: "hexArray",
      string: true,
    },
    l: {
      alias: ["last-call"],
      description:
        "The block after which the proposal can no longer be executed.",
      type: "number",
      required: true,
    },
    b: {
      alias: ["ballot"],
      description: "The initial vote from the signer's account.",
      type: "string",
      default: "yes",
      choices: ["yes", "no", "maybe"],
    },
    ...writeOptions,
  },

  handler: async ({ options, client, next }) => {
    const { drift, council } = await getWriteOptions(options, client);

    const address = await options.address({
      prompt: "Enter voting contract address",
    });

    const votingVaults = await options.vaults({
      prompt: "Enter voting vault addresses",
    });

    const extraVaultData = await options.extraVaultData();

    const targets = await options.targets({
      prompt: "Enter target addresses",
    });

    const calldatas = await options.calldatas({
      prompt: "Enter call data for each target",
    });

    const ballot = await options.ballot({
      prompt: "Select initial ballot",
    });

    const lastCallValue: number | undefined = options.values.lastCall;
    const initialCallBlock =
      lastCallValue === undefined
        ? await drift.getBlockNumber()
        : BigInt(lastCallValue);

    const lastCall = await options.lastCall({
      prompt: {
        message: "Enter the last call block",
        initial: String(initialCallBlock + DAY_IN_BLOCKS * 14n),
      },
      validate: (value) => !isNaN(Number(value)),
    });

    const hash = await council.coreVoting(address).createProposal({
      args: {
        targets,
        calldatas,
        votingVaults,
        extraVaultData,
        ballot: ballot as Ballot,
        lastCallBlock: BigInt(lastCall),
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
