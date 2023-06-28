import { LockingVault__factory } from "@council/typechain";
import signale from "signale";
import { chainOption, requiredChain } from "src/options/chain";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { createCommandModule } from "src/utils/createCommandModule";
import { deployContract, DeployedContract } from "src/utils/deployContract";
import { Hex, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Chain } from "viem/chains";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "locking-vault [OPTIONS]",
    aliases: ["LockingVault"],
    describe: "Deploy a LockingVault contract",

    builder: (yargs) => {
      return yargs.options({
        t: {
          alias: ["token"],
          describe: "The address of the ERC20 token contract",
          type: "string",
        },
        l: {
          alias: ["lag", "stale-block-lag", "staleBlockLag"],
          describe:
            "The number of blocks before the delegation history is forgotten",
          type: "number",
        },
        c: chainOption,
        r: rpcUrlOption,
        w: walletKeyOption,
      });
    },

    handler: async (args) => {
      const token = await requiredString(args.token, {
        name: "token",
        message: "Enter token address",
      });

      const lag = await requiredNumber(args.lag, {
        name: "lag",
        message: "Enter stale block lag",
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying LockingVault...");

      const { address } = await deployLockingVault({
        token,
        staleBlockLag: lag,
        account,
        rpcUrl,
        chain,
        onSubmitted: (txHash) => {
          signale.pending(`LockingVault deployment tx submitted: ${txHash}`);
        },
      });

      signale.success(`LockingVault deployed @ ${address}`);
    },
  });

export interface DeployLockingVaultOptions {
  token: string;
  staleBlockLag: number;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployLockingVault({
  token,
  staleBlockLag,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployLockingVaultOptions): Promise<DeployedContract> {
  return await deployContract({
    abi: LockingVault__factory.abi,
    args: [token, staleBlockLag],
    bytecode: LockingVault__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
