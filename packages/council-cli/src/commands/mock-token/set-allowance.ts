import { CouncilContext, MockToken } from "@council/sdk";
import { getDefaultProvider, Wallet } from "ethers";
import signale from "signale";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredNumberString } from "src/options/utils/requiredNumberString";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, describe, builder, handler } = createCommandModule({
  command: "set-allowance [OPTIONS]",
  aliases: ["setAllowance"],
  describe: "Set an account's token allowance",

  builder: (yargs) => {
    return yargs.options({
      a: {
        alias: ["address"],
        describe: "The token contract address",
        type: "string",
      },
      o: {
        alias: ["owner"],
        describe: "The address of the token owner",
        type: "string",
      },
      s: {
        alias: ["spender"],
        describe: "The address of the token spender",
        type: "string",
      },
      b: {
        alias: ["balance"],
        describe:
          "The amount of tokens the spender is allowed to spend from the owner's account",
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

    const owner = await requiredString(args.owner, {
      name: "owner",
      message: "Enter the token owner's address",
    });

    const spender = await requiredString(args.spender, {
      name: "spender",
      message: "Enter the token spender's address",
    });

    const amount = await requiredNumberString(args.balance, {
      name: "amount",
      message:
        "Enter amount of tokens the spender is allowed to spend from the owner's account",
    });

    const walletKey = await requiredWalletKey(args.walletKey);
    const rpcURL = await requiredRpcUrl(args.rpcUrl);

    const provider = getDefaultProvider(rpcURL);
    const context = new CouncilContext(provider);
    const token = new MockToken(address, context);

    const signer = new Wallet(walletKey, provider);

    signale.success(await token.setAllowance(signer, owner, spender, amount));
  },
});
