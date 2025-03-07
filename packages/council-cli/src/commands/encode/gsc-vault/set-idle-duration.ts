import { GSCVault } from "@delvtech/council-artifacts/GSCVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for GSCVault.setIdleDuration",

  options: {
    t: {
      alias: ["time", "idle-duration"],
      description:
        "The time (in seconds) new members must wait before they can vote.",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const time = await options.time({
      prompt: "Enter new idle time (in seconds)",
    });

    const encoded = encodeFunctionData({
      abi: GSCVault.abi,
      fn: "setIdleDuration",
      args: { _idleDuration: BigInt(time) },
    });

    signale.success(encoded);
    next(encoded);
  },
});
