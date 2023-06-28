import { Treasury__factory } from "@council/typechain";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const genericCall = createCommandModule({
  command: "generic-call [OPTIONS]",
  aliases: ["genericCall"],
  describe: "Encode call data for Treasury.genericCall",

  builder: (yargs) => {
    return yargs.options({
      t: {
        alias: ["target"],
        describe: `The address of the target contract`,
        type: "string",
      },
      d: {
        alias: ["data", "calldata", "call-data", "callData"],
        describe: "The encoded call data",
        type: "string",
      },
    });
  },

  handler: async (args) => {
    const target = await requiredString(args.target, {
      name: "target",
      message: "Enter target address",
    });

    const data = await requiredString(args.data, {
      name: "data",
      message: "Enter call data",
    });

    signale.success(encodeGenericCall(target, data));
  },
});

export function encodeGenericCall(target: string, data: string): string {
  return encodeFunctionData({
    abi: Treasury__factory.abi,
    functionName: "genericCall",
    args: [target, data],
  });
}
