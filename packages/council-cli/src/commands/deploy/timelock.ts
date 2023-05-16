import { Timelock__factory } from "@council/typechain";
import signale from "signale";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { createCommandModule } from "src/utils/createCommandModule";
import { deployContract, DeployedContract } from "src/utils/deployContract";
import { Hex, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Chain, localhost } from "viem/chains";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "timelock [OPTIONS]",
    aliases: ["Timelock"],
    describe: "Deploy a Timelock contract",

    builder: (yargs) => {
      return yargs.options({
        t: {
          alias: ["time", "wait-time", "waitTime"],
          describe:
            "The time (in seconds) to wait until a proposal can be executed",
          type: "number",
        },
        o: {
          alias: ["owner"],
          describe:
            "The contract owner's address (e.g., a CoreVoting contract)",
          type: "string",
        },
        g: {
          alias: ["gsc"],
          describe: "The address of the GSC contract",
          type: "string",
        },
        r: rpcUrlOption,
        w: walletKeyOption,
      });
    },

    handler: async (args) => {
      const time = await requiredNumber(args.time, {
        name: "time",
        message: "Enter wait time (in seconds)",
      });

      const owner = await requiredString(args.owner, {
        name: "owner",
        message: "Enter owner address (e.g., a CoreVoting contract)",
      });

      const gsc = await requiredString(args.gsc, {
        name: "gsc",
        message: "Enter GSC address",
      });

      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying Timelock...");

      const { address } = await deployTimelock({
        waitTime: time,
        governance: owner,
        gsc,
        account,
        rpcUrl,
        chain: localhost,
        onSubmitted: (txHash) => {
          signale.pending(`Timelock deployment tx submitted: ${txHash}`);
        },
      });

      signale.success(`Timelock deployed @ ${address}`);
    },
  });

export interface DeployTimelockOptions {
  waitTime: number;
  governance: string;
  gsc: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  timelock?: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployTimelock({
  waitTime,
  governance,
  gsc,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployTimelockOptions): Promise<DeployedContract> {
  return await deployContract({
    abi: Timelock__factory.abi,
    args: [waitTime, governance, gsc],
    bytecode: Timelock__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
