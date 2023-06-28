import { Airdrop__factory } from "@council/typechain";
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
    command: "airdrop [OPTIONS]",
    aliases: ["Airdrop"],
    describe: "Deploy an Airdrop contract",

    builder: (yargs) => {
      return yargs.options({
        o: {
          alias: ["owner", "governance"],
          describe: "The contract owner's address (e.g., a Timelock contract)",
          type: "string",
        },
        r: {
          alias: ["root", "merkle-root", "merkleRoot"],
          describe: "The merkle root of the airdrop",
          type: "string",
        },
        t: {
          alias: ["token"],
          describe: "The address of the ERC20 token contract",
          type: "string",
        },
        v: {
          alias: ["locking-vault", "lockingVault"],
          describe:
            "The address of the locking vault contract that will be used when calling OptimisticRewards.claimAndDelegate()",
          type: "string",
        },
        e: {
          alias: ["expiration"],
          describe:
            "The expiration timestamp (in seconds) after which the funds can be reclaimed by the owner",
          type: "number",
        },
        c: chainOption,
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
        message: "Enter merkle root",
      });

      const token = await requiredString(args.token, {
        name: "token",
        message: "Enter token address",
      });

      const lockingVault = await requiredString(args.lockingVault, {
        name: "lockingVault",
        message: "Enter locking vault address",
      });

      const expiration = await requiredNumber(args.expiration, {
        name: "expiration",
        message: "Enter expiration timestamp (in seconds)",
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying Airdrop...");

      const { address } = await deployAirDrop({
        owner,
        merkleRoot: root,
        token,
        expiration,
        lockingVault,
        account,
        rpcUrl,
        chain,
        onSubmitted: (txHash) => {
          signale.pending(`Airdrop deployment tx submitted: ${txHash}`);
        },
      });

      signale.success(`Airdrop deployed @ ${address}`);
    },
  });

export interface DeployAirDropOptions {
  owner: string;
  merkleRoot: string;
  token: string;
  expiration: number;
  lockingVault: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployAirDrop({
  owner,
  merkleRoot,
  token,
  expiration,
  lockingVault,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployAirDropOptions): Promise<DeployedContract> {
  return deployContract({
    abi: Airdrop__factory.abi,
    args: [owner, merkleRoot, token, expiration, lockingVault],
    bytecode: Airdrop__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
