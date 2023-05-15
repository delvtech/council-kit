import { OptimisticRewards__factory } from "@council/typechain";
import { Interface } from "ethers/lib/utils";
import signale from "signale";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "propose-rewards [OPTIONS]",
    aliases: ["proposeRewards"],
    describe: "Encode call data for OptimisticRewards.proposeRewards",

    builder: (yargs) => {
      return yargs.options({
        r: {
          alias: ["root"],
          describe: "The merkle root of the proposed new rewards",
          type: "string",
        },
      });
    },

    handler: async (args) => {
      const root = await requiredString(args.root, {
        name: "root",
        message: "Enter rewards merkle root",
      });

      signale.success(encodeProposeRewards(root));
    },
  });

export function encodeProposeRewards(root: string): string {
  const optimisticRewardsInterface = new Interface(
    OptimisticRewards__factory.abi,
  );
  return optimisticRewardsInterface.encodeFunctionData("proposeRewards", [
    root,
  ]);
}
