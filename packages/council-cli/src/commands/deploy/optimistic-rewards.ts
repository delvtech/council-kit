import { OptimisticRewards__factory } from "@council/typechain";
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
    command: "optimistic-rewards [OPTIONS]",
    aliases: ["OptimisticRewards"],
    describe: "Deploy a OptimisticRewards contract",

    builder: (yargs) => {
      return yargs.options({
        o: {
          alias: ["owner", "governance"],
          describe: "The contract owner's address (e.g., a Timelock contract)",
          type: "string",
        },
        r: {
          alias: ["root", "starting-root", "startingRoot"],
          describe: "The starting merkle root",
          type: "string",
        },
        p: {
          alias: ["proposer"],
          describe: "The address that can propose new roots",
          type: "string",
        },
        c: {
          alias: ["revoker", "challenger"],
          describe: "The address that can remove proposed reward roots",
          type: "string",
        },
        t: {
          alias: ["token"],
          describe: "The address of the ERC20 token to distribute",
          type: "string",
        },
        v: {
          alias: ["locking-vault", "lockingVault"],
          describe:
            "The address of the locking vault contract that will be used when calling Airdrop.claimAndDelegate()",
          type: "string",
        },
        n: chainOption,
        u: rpcUrlOption,
        w: walletKeyOption,
      });
    },

    handler: async (args) => {
      const owner = await requiredString(args.owner, {
        name: "owner",
        message: "Enter owner address (e.g., a Timelock contract)",
      });

      const root = await requiredString(args.root, {
        name: "root",
        message: "Enter starting root",
      });

      const proposer = await requiredString(args.proposer, {
        name: "proposer",
        message: "Enter proposer address",
      });

      const revoker = await requiredString(args.revoker, {
        name: "revoker",
        message: "Enter revoker address",
      });

      const token = await requiredString(args.token, {
        name: "token",
        message: "Enter token address",
      });

      const lockingVault = await requiredString(args.lockingVault, {
        name: "lockingVault",
        message: "Enter locking vault address",
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying OptimisticRewards...");

      const { address } = await deployOptimisticRewards({
        owner,
        startingRoot: root,
        proposer,
        revoker,
        token,
        lockingVault,
        account,
        rpcUrl,
        chain,
        onSubmitted: (txHash) => {
          signale.pending(
            `OptimisticRewards deployment tx submitted: ${txHash}`,
          );
        },
      });

      signale.success(`OptimisticRewards deployed @ ${address}`);
    },
  });

export interface DeployOptimisticRewardsOptions {
  owner: string;
  startingRoot: string;
  proposer: string;
  revoker: string;
  token: string;
  lockingVault: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployOptimisticRewards({
  owner,
  startingRoot,
  proposer,
  revoker,
  token,
  lockingVault,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployOptimisticRewardsOptions): Promise<DeployedContract> {
  return deployContract({
    abi: OptimisticRewards__factory.abi,
    args: [owner, startingRoot, proposer, revoker, token, lockingVault],
    bytecode: OptimisticRewards__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
