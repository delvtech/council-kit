import { Timelock } from "@council/artifacts/Timelock";
import { command } from "clide-js";
import signale from "signale";
import {
  callHashOptions,
  getCallHash,
} from "src/reusable-options/call-hash.js";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for Timelock.stopCall",

  options: callHashOptions,

  handler: async ({ options, next }) => {
    const callHash = await getCallHash(
      options.callHash,
      options.targets,
      options.calldatas,
    );

    const encoded = encodeStopCall(callHash);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeStopCall(callHash: string): string {
  return encodeFunctionData({
    abi: Timelock.abi,
    functionName: "stopCall",
    args: [callHash as `0x${string}`],
  });
}
