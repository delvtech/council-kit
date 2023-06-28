import { GSCVault__factory } from "@council/typechain";
import signale from "signale";
import { chainOption, requiredChain } from "src/options/chain";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredNumberString } from "src/options/utils/requiredNumberString";
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
    command: "gsc-vault [OPTIONS]",
    aliases: ["GSCVault"],
    describe: "Deploy a GSCVault contract",

    builder: (yargs) => {
      return yargs.options({
        c: {
          alias: ["core-voting", "coreVoting"],
          describe: "The address of the CoreVoting contract",
          type: "string",
        },
        b: {
          alias: ["bound", "voting-power-bound", "votingPowerBound"],
          describe: "The minimum voting power required to become a member",
          type: "string",
        },
        d: {
          alias: ["decimals"],
          describe:
            "The decimal precision to use. The bound option will be multiplied by (10 ** decimals). For example, if bound is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
        o: {
          alias: ["owner"],
          describe: "The owner of the contract (e.g., a Timelock contract)",
          type: "string",
        },
        n: chainOption,
        r: rpcUrlOption,
        w: walletKeyOption,
      });
    },

    handler: async (args) => {
      const coreVoting = await requiredString(args.coreVoting, {
        name: "core-voting",
        message: "Enter CoreVoting address",
      });

      const bound = await requiredNumberString(args.bound, {
        name: "bound",
        message: "Enter voting power bound",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      const owner = await requiredString(args.owner, {
        name: "owner",
        message: "Enter owner address (e.g., a Timelock contract)",
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying GSCVault...");

      const { address } = await deployGSCVault({
        coreVoting,
        votingPowerBound: bound,
        decimals,
        owner,
        account,
        rpcUrl,
        chain,
        onSubmitted: (txHash) => {
          signale.pending(`GSCVault deployment tx submitted: ${txHash}`);
        },
      });

      signale.success(`GSCVault deployed @ ${address}`);
    },
  });

export interface DeployGSCVaultOptions {
  coreVoting: string;
  votingPowerBound: string;
  decimals: number;
  owner: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployGSCVault({
  coreVoting,
  votingPowerBound,
  decimals,
  owner,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployGSCVaultOptions): Promise<DeployedContract> {
  return await deployContract({
    abi: GSCVault__factory.abi,
    args: [coreVoting, parseBigInt(votingPowerBound, decimals), owner],
    bytecode: GSCVault__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
