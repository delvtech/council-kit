import { Timelock } from "@delvtech/council-artifacts/Timelock";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { callHashOptions, getCallHash } from "../../../options/call-hash.js";

export default command({
  description: "Encode call data for Timelock.registerCall",

  options: callHashOptions,

  handler: async ({ options, next }) => {
    const callHash = await getCallHash(
      options.callHash,
      options.targets,
      options.calldatas,
    );

    const encoded = encodeFunctionData({
      abi: Timelock.abi,
      fn: "registerCall",
      args: { callHash },
    });

    signale.success(encoded);
    next(encoded);
  },
});
