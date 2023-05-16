/**
 * A command module for encoding call data for OptimisticGrants.claim
 */

import { OptimisticGrants__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, describe, builder, handler } = createCommandModule({
  command: "claim",
  describe: "Encode call data for OptimisticGrants.claim",

  builder: (yargs) => {
    return yargs.options({
      r: {
        alias: ["recipient", "destination"],
        description: "The address to send the tokens to",
        type: "string",
      },
    });
  },

  handler: async (args) => {
    const recipient = await requiredString(args.recipient, {
      name: "recipient",
      message: "Enter recipient address",
    });

    signale.success(encodeClaim(recipient));
  },
});

export function encodeClaim(recipient: string): string {
  const optimisticGrantsInterface = new Interface(
    OptimisticGrants__factory.abi,
  );
  return optimisticGrantsInterface.encodeFunctionData("claim", [recipient]);
}
