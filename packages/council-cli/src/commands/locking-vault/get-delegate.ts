import { CouncilContext, LockingVault } from "@council/sdk";
import { getDefaultProvider } from "ethers";
import signale from "signale";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredString } from "src/options/utils/requiredString";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, describe, builder, handler } = createCommandModule({
  command: "get-delegate [OPTIONS]",
  describe: "Get the delegate of a given account.",

  builder: (yargs) => {
    return yargs.options({
      v: {
        alias: ["address"],
        describe: "The LockingVault contract address",
        type: "string",
      },
      a: {
        alias: ["account"],
        describe: "The account to get the delegate of",
        type: "string",
      },
      r: rpcUrlOption,
    });
  },

  handler: async (args) => {
    const address = await requiredString(args.address, {
      name: "address",
      message: "Enter LockingVault contract address",
    });

    const account = await requiredString(args.account, {
      name: "account",
      message: "Enter account to get delegate of",
    });

    const rpcURL = await requiredRpcUrl(args.rpcUrl);

    const provider = getDefaultProvider(rpcURL);
    const context = new CouncilContext(provider);
    const lockingVault = new LockingVault(address, context);

    const delegate = await lockingVault.getDelegate(account);
    signale.success(await delegate.address);
  },
});
