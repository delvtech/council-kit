import { ReadWriteCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import signale from "signale";
import { createPublicClient, createWalletClient, http } from "viem";
import {
  getWriteOptions,
  writeOptions,
} from "../../reusable-options/writeOptions.js";

export default command({
  description: "Change a vault's status in a CoreVoting contract.",

  options: {
    address: {
      describe: "The CoreVoting contract address",
      type: "string",
      required: true,
    },
    vault: {
      describe: "The vault address",
      type: "string",
      required: true,
    },
    valid: {
      alias: ["is-valid", "approved"],
      describe: "Whether or not the vault is valid",
      type: "boolean",
      default: true,
      required: true,
    },
    ...writeOptions,
  },

  handler: async ({ options, context, next }) => {
    const {
      account: signerAccount,
      chain,
      rpcUrl,
    } = await getWriteOptions(options, context);

    const address = await options.address({
      prompt: "Enter Core Voting address",
    });

    const vault = await options.vault({
      prompt: "Enter Vault address",
    });

    const isValid = await options.valid({
      prompt: "Is the vault valid/approved?",
    });

    const transport = http(rpcUrl);
    const publicClient = createPublicClient({ chain, transport });
    const walletClient = createWalletClient({
      transport,
      chain,
      account: signerAccount,
    });

    const coreVoting = new ReadWriteCouncil({
      publicClient,
      walletClient,
    }).coreVoting({ address: address as `0x${string}` });

    const hash = await coreVoting.changeVaultStatus({
      vault: vault as `0x${string}`,
      isValid,
    });

    signale.success(hash);
    next(hash);
  },
});
