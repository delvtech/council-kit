import { Treasury__factory } from "@council/typechain";
import signale from "signale";
import { chainOption, requiredChain } from "src/options/chain";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { createCommandModule } from "src/utils/createCommandModule";
import { deployContract, DeployedContract } from "src/utils/deployContract";
import { Hex, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Chain } from "viem/chains";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "treasury [OPTIONS]",
    aliases: ["Treasury"],
    describe: "Deploy a Treasury contract",

    builder: (yargs) => {
      return yargs.options({
        o: {
          alias: ["owner"],
          describe: "The contract owner's address (e.g., a Timelock contract)",
          type: "string",
        },
        c: chainOption,
        r: rpcUrlOption,
        w: walletKeyOption,
      });
    },

    handler: async (args) => {
      const owner = await requiredString(args.owner, {
        name: "owner",
        message: "Enter owner address (e.g., a Timelock contract)",
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying Treasury...");

      const { address } = await deployTreasury({
        owner,
        account,
        rpcUrl,
        chain,
        onSubmitted: (txHash) => {
          signale.pending(`Treasury deployment tx submitted: ${txHash}`);
        },
      });

      signale.success(`Treasury deployed @ ${address}`);
    },
  });

export interface DeployTreasuryOptions {
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  owner?: string;
  onSubmitted?: (txHash: string) => void;
}

export async function deployTreasury({
  account,
  rpcUrl,
  chain,
  owner = account.address,
  onSubmitted,
}: DeployTreasuryOptions): Promise<DeployedContract> {
  return await deployContract({
    abi: Treasury__factory.abi,
    args: [owner],
    bytecode: Treasury__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
