import { Treasury__factory } from "@council/typechain";
import signale from "signale";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { createCommandModule } from "src/utils/createCommandModule";
import { deployContract, DeployedContract } from "src/utils/deployContract";
import { Hex, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Chain, localhost } from "viem/chains";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "treasury [OPTIONS]",
    aliases: ["Treasury"],
    describe: "Deploy a Treasury contract",

    builder: (yargs) => {
      return yargs.options({
        o: {
          alias: ["owner"],
          describe: "The owner of the contract (e.g., a Timelock contract)",
          type: "string",
        },
        r: rpcUrlOption,
        w: walletKeyOption,
      });
    },

    handler: async (args) => {
      const owner = await requiredString(args.owner, {
        name: "owner",
        message: "Enter owner address (e.g., a Timelock contract)",
      });

      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying Treasury...");

      const { address } = await deployTreasury({
        governance: owner,
        account,
        rpcUrl,
        chain: localhost,
        onSubmitted: (txHash) => {
          signale.pending(`Treasury deployment tx submitted: ${txHash}`);
        },
      });

      signale.success(`Treasury deployed @ ${address}`);
    },
  });

export interface DeployTreasuryOptions {
  governance: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  timelock?: string;
  onSubmitted?: (txHash: string) => void;
}

export async function deployTreasury({
  governance,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployTreasuryOptions): Promise<DeployedContract> {
  return await deployContract({
    abi: Treasury__factory.abi,
    args: [governance],
    bytecode: Treasury__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
