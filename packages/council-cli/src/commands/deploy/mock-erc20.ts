import { MockERC20 } from "@council/artifacts/MockERC20";
import { command } from "clide-js";
import signale from "signale";
import { WriteOptions } from "src/reusable-options/writeOptions.js";
import { PrivateKeyAccount } from "viem";
import { Chain } from "viem/chains";
import {
  DeployedContract,
  deployContract,
} from "../../utils/deployContract.js";

export default command({
  description: "Deploy a MockERC20 contract for use as a mock voting token",

  options: {
    name: {
      description: "The name of the token",
      type: "string",
      required: true,
    },
    symbol: {
      description: "The symbol of the token",
      type: "string",
      required: true,
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const name = await options.name({
      prompt: "Enter token name",
    });

    const symbol = await options.symbol({
      prompt: "Enter token symbol",
    });

    signale.pending("Deploying MockERC20...");

    const deployData = await deployMockERC20({
      tokenName: name,
      tokenSymbol: symbol,
      account,
      rpcUrl,
      chain,
      onSubmitted: (txHash) => {
        signale.pending(`MockERC20 deployment tx submitted: ${txHash}`);
      },
    });

    signale.success(`MockERC20 deployed @ ${deployData.address}`);
    next(deployData);
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
    abi: MockERC20.abi,
    args: [tokenName, tokenSymbol, account.address],
    bytecode: MockERC20.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
