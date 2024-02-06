import { GSCVault } from "@council/artifacts/GSCVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for GSCVault.setIdleDuration",

  options: {
    time: {
      alias: ["idle-duration"],
      description:
        "The time (in seconds) new members must wait before they can vote",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const time = await options.time({
      prompt: "Enter new idle time (in seconds)",
    });
    const encoded = encodeSetIdleDuration(time);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeSetIdleDuration(time: number): string {
  return encodeFunctionData({
    abi: GSCVault.abi,
    functionName: "setIdleDuration",
    args: [BigInt(time)],
  });
}
