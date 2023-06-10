import { CouncilContext, MockToken } from "@council/sdk";
import { getDefaultProvider, Wallet } from "ethers";
import signale from "signale";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredNumberString } from "src/options/utils/requiredNumberString";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, describe, builder, handler } = createCommandModule({
  command: "set-balance [OPTIONS]",
  aliases: ["setBalance"],
  describe: "Set an account's token balance",

  builder: (yargs) => {
    return yargs.options({
      a: {
        alias: ["address"],
        describe: "The token contract address",
        type: "string",
      },
      f: {
        alias: ["account"],
        describe: "The account to set balance for",
        type: "string",
      },
      b: {
        alias: ["balance"],
        describe: "The new balance (as a decimal string) for the account",
        type: "string",
      },
      w: walletKeyOption,
      r: rpcUrlOption,
    });
  },

  handler: async (args) => {
    const address = await requiredString(args.address, {
      name: "address",
      message: "Enter token contract address",
    });

    const account = await requiredString(args.account, {
      name: "account",
      message: "Enter account to set balance for",
    });

    const balance = await requiredNumberString(args.balance, {
      name: "balance",
      message: "Enter new balance for account",
    });

    const walletKey = await requiredWalletKey(args.walletKey);
    const rpcURL = await requiredRpcUrl(args.rpcUrl);

    const provider = getDefaultProvider(rpcURL);
    const context = new CouncilContext(provider);
    const token = new MockToken(address, context);

    const signer = new Wallet(walletKey, provider);

    signale.success(await token.setBalance(signer, account, balance));
  },
});
