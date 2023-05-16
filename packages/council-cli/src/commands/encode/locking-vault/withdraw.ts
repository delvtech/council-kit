import { LockingVault__factory } from "@council/typechain";
import { Interface, parseUnits } from "ethers/lib/utils";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, describe, builder, handler } = createCommandModule({
  command: "withdraw [OPTIONS]",
  describe: "Encode call data for LockingVault.withdraw",

  builder: (yargs) => {
    return yargs.options({
      a: {
        alias: ["amount"],
        describe: "The amount of tokens to withdraw",
        type: "string",
      },
      d: {
        alias: ["decimals"],
        describe:
          "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
        type: "number",
      },
    });
  },

  handler: async (args) => {
    const amount = await requiredString(args.amount, {
      name: "amount",
      message: "Enter amount to deposit",
    });

    const decimals = await requiredNumber(args.decimals, {
      name: "decimals",
      message: "Enter decimal precision",
      initial: 18,
    });

    signale.success(encodeWithdraw(amount, decimals));
  },
});

export function encodeWithdraw(amount: string, decimals = 0): string {
  const lockingVaultInterface = new Interface(LockingVault__factory.abi);
  return lockingVaultInterface.encodeFunctionData("withdraw", [
    parseUnits(amount, decimals),
  ]);
}
