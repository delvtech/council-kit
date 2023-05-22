import { CoreVoting__factory } from "@council/typechain";
import signale from "signale";
import { chainOption, requiredChain } from "src/options/chain";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredArray } from "src/options/utils/requiredArray";
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
    command: "core-voting [OPTIONS]",
    aliases: ["CoreVoting"],
    describe: "Deploy a CoreVoting contract",

    builder: (yargs) => {
      return yargs.options({
        o: {
          alias: ["owner", "timelock"],
          describe: "The contract owner's address (e.g., a Timelock contract)",
          type: "string",
        },
        q: {
          alias: ["quorum", "base-quorum", "baseQuorum"],
          describe: "The default quorum for proposals",
          type: "string",
        },
        m: {
          alias: ["min-power", "min-proposal-power", "minProposalPower"],
          describe: "The minimum voting power required to create a proposal",
          type: "string",
        },
        d: {
          alias: ["decimals"],
          describe:
            "The decimal precision to use. The quorum and power options will be multiplied by (10 ** decimals). For example, if quorum is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
        g: {
          alias: ["gsc"],
          describe: "The address of the Governance Steering Committee contract",
          type: "string",
        },
        v: {
          alias: ["vaults", "voting-vaults", "votingVaults"],
          describe: "The addresses of the approved voting vaults",
          type: "array",
          string: true,
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

      const quorum = await requiredNumberString(args.quorum, {
        name: "quorum",
        message: "Enter default quorum",
      });

      const minPower = await requiredNumberString(args.minPower, {
        name: "min-power",
        message: "Enter minimum proposal power",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      const gsc = await requiredString(args.gsc, {
        name: "gsc",
        message: "Enter GSC address",
      });

      const vaults = await requiredArray(args.vaults, {
        name: "vaults",
        message: "Enter approved voting vaults",
        validate: () => true,
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying CoreVoting...");

      const { address } = await deployCoreVoting({
        owner,
        quorum,
        minPower,
        decimals,
        gsc,
        vaults,
        account,
        rpcUrl,
        chain,
        onSubmitted: (txHash) => {
          signale.pending(`CoreVoting deployment tx submitted: ${txHash}`);
        },
      });

      signale.success(`CoreVoting deployed @ ${address}`);
    },
  });

export interface DeployCoreVotingOptions {
  quorum: string;
  minPower: string;
  decimals: number;
  gsc: string;
  vaults: string[];
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  owner?: string;
  onSubmitted?: (txHash: string) => void;
}

export async function deployCoreVoting({
  quorum,
  minPower,
  decimals,
  gsc,
  vaults,
  account,
  rpcUrl,
  chain,
  owner = account.address,
  onSubmitted,
}: DeployCoreVotingOptions): Promise<DeployedContract> {
  return await deployContract({
    abi: CoreVoting__factory.abi,
    args: [
      owner,
      parseBigInt(quorum, decimals),
      parseBigInt(minPower, decimals),
      gsc,
      vaults,
    ],
    bytecode: CoreVoting__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
