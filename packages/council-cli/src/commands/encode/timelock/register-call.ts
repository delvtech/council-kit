import { Timelock } from "@council/artifacts/Timelock";
import { command } from "clide-js";
import signale from "signale";
import {
  callHashOptions,
  getCallHash,
} from "src/reusable-options/call-hash.js";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for Timelock.registerCall",

  options: callHashOptions,

  handler: async ({ options, next }) => {
    const callHash = await getCallHash(
      options.callHash,
      options.targets,
      options.calldatas,
    );

    const encoded = encodeRegisterCall(callHash);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeRegisterCall(callHash: string): string {
  return encodeFunctionData({
    abi: Timelock.abi,
    functionName: "registerCall",
    args: [callHash as `0x${string}`],
  });
}
