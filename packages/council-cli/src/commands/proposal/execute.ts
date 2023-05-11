import { CouncilContext, Proposal } from "@council/sdk";
import { getDefaultProvider, Wallet } from "ethers";
import signale from "signale";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, describe, builder, handler } = createCommandModule({
  command: "execute [OPTIONS]",
  describe: "Execute a proposal",

  builder: (yargs) => {
    return yargs.options({
      a: {
        alias: ["address"],
        describe: "The voting contract address",
        type: "string",
      },
      p: {
        alias: ["id"],
        describe: "The id of the proposal to execute",
        type: "number",
      },
      r: rpcUrlOption,
      w: walletKeyOption,
    });
  },

  handler: async (args) => {
    const address = await requiredString(args.address, {
      name: "address",
      message: "Enter voting contract address",
    });

    const id = await requiredNumber(args.id, {
      name: "id",
      message: "Enter proposal id",
    });

    const rpcUrl = await requiredRpcUrl(args.rpcUrl);
    const walletKey = await requiredWalletKey(args.walletKey);

    const provider = getDefaultProvider(rpcUrl);
    const context = new CouncilContext(provider);
    const proposal = new Proposal(id, address, context);

    const signer = new Wallet(walletKey, provider);

    signale.success(await proposal.execute(signer));
  },
});
