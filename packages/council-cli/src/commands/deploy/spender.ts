import { Spender__factory } from "@council/typechain";
import signale from "signale";
import { chainOption, requiredChain } from "src/options/chain";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { deployContract, DeployedContract } from "src/utils/deployContract";
import { Hex, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Chain } from "viem/chains";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "spender [OPTIONS]",
    aliases: ["Spender"],
    describe: "Deploy a Spender contract",

    builder: (yargs) => {
      return yargs.options({
        o: {
          alias: ["owner"],
          describe: "The contract owner's address (e.g., a Timelock contract)",
          type: "string",
        },
        a: {
          alias: ["spender"],
          describe: "The first address authorized to spend tokens",
          type: "string",
        },
        t: {
          alias: ["token"],
          describe: "The address of the ERC20 token contract",
          type: "string",
        },
        s: {
          alias: ["small", "small-spend-limit", "smallSpendLimit"],
          describe: "The small spend proposal limit",
          type: "string",
        },
        m: {
          alias: ["medium", "medium-spend-limit", "mediumSpendLimit"],
          describe: "The medium spend proposal limit",
          type: "string",
        },
        h: {
          alias: ["high", "high-spend-limit", "highSpendLimit"],
          describe: "The high spend proposal limit",
          type: "string",
        },
        d: {
          alias: ["decimals"],
          describe:
            "The decimal precision to use. The limit options will be multiplied by (10 ** decimals). For example, if the small limit is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
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

      const spender = await requiredString(args.spender, {
        name: "spender",
        message: "Enter spender address",
      });

      const token = await requiredString(args.token, {
        name: "token",
        message: "Enter token address",
      });

      const small = await requiredString(args.small, {
        name: "small",
        message: "Enter small spend limit",
      });

      const medium = await requiredString(args.medium, {
        name: "medium",
        message: "Enter medium spend limit",
      });

      const high = await requiredString(args.high, {
        name: "high",
        message: "Enter high spend limit",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying Spender...");

      const { address } = await deploySpender({
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

      signale.success(`Spender deployed @ ${address}`);
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
    abi: Spender__factory.abi,
    args: [
      owner,
      spender,
      token,
      parseBigInt(smallSpendLimit, decimals),
      parseBigInt(mediumSpendLimit, decimals),
      parseBigInt(highSpendLimit, decimals),
    ],
    bytecode: Spender__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
