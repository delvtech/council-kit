import { MockERC20__factory } from "@council/typechain";
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
    command: "mock-erc20 [OPTIONS]",
    aliases: ["MockERC20"],
    describe: "Deploy a MockERC20 contract for use as a mock voting token",

    builder: (yargs) => {
      return yargs.options({
        n: {
          alias: ["name"],
          describe: "The name of the token",
          type: "string",
        },
        s: {
          alias: ["symbol"],
          describe: "The symbol of the token",
          type: "string",
        },
        c: chainOption,
        r: rpcUrlOption,
        w: walletKeyOption,
      });
    },

    handler: async (args) => {
      const name = await requiredString(args.name, {
        name: "name",
        message: "Enter token name",
      });

      const symbol = await requiredString(args.symbol, {
        name: "symbol",
        message: "Enter token symbol",
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying MockERC20...");

      const { address } = await deployMockERC20({
        tokenName: name,
        tokenSymbol: symbol,
        account,
        rpcUrl,
        chain,
        onSubmitted: (txHash) => {
          signale.pending(`MockERC20 deployment tx submitted: ${txHash}`);
        },
      });

      signale.success(`MockERC20 deployed @ ${address}`);
    },
  });

export interface DeployMockERC20Options {
  tokenName: string;
  tokenSymbol: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployMockERC20({
  tokenName,
  tokenSymbol,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployMockERC20Options): Promise<DeployedContract> {
  return await deployContract({
    abi: MockERC20__factory.abi,
    args: [tokenName, tokenSymbol, account.address],
    bytecode: MockERC20__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
