import { VestingVault } from "@council/artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData } from "viem";

export default command({
  description: "Encode call data for VestingVault.acceptGrant",

  handler: ({ next }) => {
    const encoded = encodeAcceptGrant();
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeAcceptGrant(): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "acceptGrant",
  });
}
