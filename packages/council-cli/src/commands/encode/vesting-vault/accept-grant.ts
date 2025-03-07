import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";

export default command({
  description: "Encode call data for VestingVault.acceptGrant",

  handler: ({ next }) => {
    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "acceptGrant",
    });

    signale.success(encoded);
    next(encoded);
  },
});
