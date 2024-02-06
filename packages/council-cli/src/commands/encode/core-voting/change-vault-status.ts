import { CoreVoting } from "@council/artifacts/CoreVoting";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for CoreVoting.changeVaultStatus",

  options: {
    vault: {
      description: "The voting vault's address",
      type: "string",
      required: true,
    },
    approved: {
      alias: ["is-valid"],
      description: "Whether or not the vault should be approved",
      type: "boolean",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const vault = await options.vault({
      prompt: "Enter voting vault address",
    });

    const approved = await options.approved({
      prompt: {
        message: "Enter approval status",
        active: "Approved",
        inactive: "Not Approved",
      },
    });

    const encoded = encodeChangeVaultStatus(vault, approved);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeChangeVaultStatus(
  vault: string,
  approved: boolean,
): string {
  return encodeFunctionData({
    abi: CoreVoting.abi,
    functionName: "changeVaultStatus",
    args: [vault as `0x${string}`, approved],
  });
}
