import { command } from "clide-js";
import signale from "signale";
import { getWriteOptions, writeOptions } from "../../options/writeOptions.js";

export default command({
  description: "Change a vault's status in a CoreVoting contract.",

  options: {
    a: {
      alias: ["address"],
      description: "The CoreVoting contract address.",
      type: "string",
      customType: "hex",
      required: true,
    },
    v: {
      alias: ["vault"],
      description: "The vault address.",
      type: "string",
      customType: "hex",
      required: true,
    },
    V: {
      alias: ["valid", "approved"],
      description: "Whether or not the vault is valid.",
      type: "boolean",
      default: true,
      required: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, client, next }) => {
    const { council, publicClient } = await getWriteOptions(options, client);

    const address = await options.address({
      prompt: "Enter Core Voting address",
    });

    const vault = await options.vault({
      prompt: "Enter Vault address",
    });

    const isValid = await options.valid({
      prompt: "Is the vault valid/approved?",
    });

    const hash = await council.coreVoting(address).changeVaultStatus({
      args: { vault, isValid },
      options: {
        onMined: () => {
          signale.success(`Transaction success: ${hash}`);
        },
      },
    });

    signale.pending(`Transaction submitted: ${hash}`);
    await publicClient.waitForTransactionReceipt({ hash });
    next(hash);
  },
});
