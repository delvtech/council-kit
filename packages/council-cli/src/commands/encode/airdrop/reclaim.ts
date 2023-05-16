import { Airdrop__factory } from "@council/typechain";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, describe, builder, handler } = createCommandModule({
  command: "reclaim [OPTIONS]",
  describe: "Encode call data for Airdrop.reclaim",

  builder: (yargs) => {
    return yargs.options({
      r: {
        alias: ["recipient", "destination"],
        describe: "The recipient of the reclaimed funds",
        type: "string",
      },
    });
  },

  handler: async (args) => {
    const recipient = await requiredString(args.recipient, {
      name: "recipient",
      message: "Enter recipient address",
    });

    signale.success(encodeReclaim(recipient));
  },
});

function encodeReclaim(recipient: string) {
  return encodeFunctionData({
    abi: Airdrop__factory.abi,
    functionName: "reclaim",
    args: [recipient],
  });
}
