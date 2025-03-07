import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for CoreVoting.changeVaultStatus",

  options: {
    v: {
      alias: ["vault"],
      description: "The voting vault's address",
      type: "hex",
      required: true,
    },
    a: {
      alias: ["approved", "is-valid"],
      description: "Whether or not the vault should be approved",
      type: "boolean",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const vault = await options.vault({
      prompt: "Enter voting vault address",
    });

    const isValid = await options.isValid({
      prompt: {
        message: "Enter approval status",
        active: "Approved",
        inactive: "Not Approved",
      },
    });

    const encoded = encodeFunctionData({
      abi: CoreVoting.abi,
      fn: "changeVaultStatus",
      args: { isValid, vault },
    });

    signale.success(encoded);
    next(encoded);
  },
});
