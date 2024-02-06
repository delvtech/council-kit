import { Spender } from "@council/artifacts/Spender";
import { command } from "clide-js";
import signale from "signale";
import { PrivateKeyAccount, parseUnits } from "viem";
import { Chain } from "viem/chains";
import { WriteOptions } from "../../reusable-options/write-options.js";
import {
  DeployedContract,
  deployContract,
} from "../../utils/deployContract.js";

export default command({
  description: "Deploy a Spender contract",

  options: {
    owner: {
      description: "The contract owner's address (e.g., a Timelock contract)",
      type: "string",
    },
    spender: {
      description: "The first address authorized to spend tokens",
      type: "string",
    },
    token: {
      description: "The address of the ERC20 token contract",
      type: "string",
      required: true,
    },
    small: {
      alias: ["small-spend-limit"],
      description: "The small spend proposal limit",
      type: "string",
      required: true,
    },
    medium: {
      alias: ["medium-spend-limit"],
      description: "The medium spend proposal limit",
      type: "string",
      required: true,
    },
    high: {
      alias: ["high-spend-limit"],
      description: "The high spend proposal limit",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision to use. The limit options will be multiplied by (10 ** decimals). For example, if the small limit is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const owner = (await options.owner()) || account.address;

    const spender = (await options.spender()) || owner;

    const token = await options.token({
      prompt: "Enter token address",
    });

    const small = await options.small({
      prompt: "Enter small spend limit",
    });

    const medium = await options.medium({
      prompt: "Enter medium spend limit",
    });

    const high = await options.high({
      prompt: "Enter high spend limit",
    });

    const decimals = await options.decimals();

    signale.pending("Deploying Spender...");

    const deployData = await deploySpender({
      owner,
      spender,
      token,
      smallSpendLimit: small,
      mediumSpendLimit: medium,
      highSpendLimit: high,
      decimals,
      account,
      rpcUrl,
      chain,
      onSubmitted: (txHash) => {
        signale.pending(`Spender deployment tx submitted: ${txHash}`);
      },
    });

    signale.success(`Spender deployed @ ${deployData.address}`);
    next(deployData);
  },
});

export interface DeploySpenderOptions {
  owner: string;
  spender: string;
  token: string;
  smallSpendLimit: string;
  mediumSpendLimit: string;
  highSpendLimit: string;
  decimals: number;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deploySpender({
  owner,
  spender,
  token,
  smallSpendLimit,
  mediumSpendLimit,
  highSpendLimit,
  decimals,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeploySpenderOptions): Promise<DeployedContract> {
  return deployContract({
    abi: Spender.abi,
    args: [
      owner as `0x${string}`,
      spender as `0x${string}`,
      token as `0x${string}`,
      parseUnits(smallSpendLimit, decimals),
      parseUnits(mediumSpendLimit, decimals),
      parseUnits(highSpendLimit, decimals),
    ],
    bytecode: Spender.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
