import { OptimisticGrants__factory } from "@council/typechain";
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
    command: "optimistic-grants [OPTIONS]",
    aliases: ["OptimisticGrants"],
    describe: "Deploy an OptimisticGrants contract",

    builder: (yargs) => {
      return yargs.options({
        t: {
          alias: ["token"],
          describe: "The address of the ERC20 token to distribute",
          type: "string",
        },
        g: {
          alias: ["governance"],
          describe:
            "The governance contract's address for ACL (e.g., a Timelock contract)",
          type: "string",
        },
        c: chainOption,
        u: rpcUrlOption,
        w: walletKeyOption,
      });
    },

    handler: async (args) => {
      const token = await requiredString(args.token, {
        name: "token",
        message: "Enter token address",
      });

      const governance = await requiredString(args.governance, {
        name: "governance",
        message: "Enter governance address (e.g., a Timelock contract)",
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying OptimisticGrants...");

      const { address } = await deployOptimisticGrants({
        token,
        governance,
        account,
        rpcUrl,
        chain,
        onSubmitted: (txHash) => {
          signale.pending(
            `OptimisticGrants deployment tx submitted: ${txHash}`,
          );
        },
      });

      signale.success(`OptimisticGrants deployed @ ${address}`);
    },
  });

export interface DeployOptimisticGrantsOptions {
  token: string;
  governance: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployOptimisticGrants({
  token,
  governance,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployOptimisticGrantsOptions): Promise<DeployedContract> {
  return deployContract({
    abi: OptimisticGrants__factory.abi,
    args: [token, governance],
    bytecode: OptimisticGrants__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
