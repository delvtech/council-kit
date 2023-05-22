import { SimpleProxy__factory } from "@council/typechain";
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
    command: "simple-proxy [OPTIONS]",
    aliases: ["SimpleProxy"],
    describe: "Deploy a SimpleProxy contract",

    builder: (yargs) => {
      return yargs.options({
        o: {
          alias: ["owner"],
          describe: "The contract owner's address (e.g., a Timelock contract)",
          type: "string",
        },
        i: {
          alias: [
            "implementation",
            "first-implementation",
            "firstImplementation",
          ],
          describe: "The address that calls to the proxy will be forwarded to",
          type: "string",
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

      const implementation = await requiredString(args.implementation, {
        name: "implementation",
        message: "Enter implementation address",
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying SimpleProxy...");

      const { address } = await deploySimpleProxy({
        owner,
        implementation,
        account,
        rpcUrl,
        chain,
        onSubmitted: (txHash) => {
          signale.pending(`SimpleProxy deployment tx submitted: ${txHash}`);
        },
      });

      signale.success(`SimpleProxy deployed @ ${address}`);
    },
  });

export interface DeploySimpleProxyOptions {
  owner: string;
  implementation: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deploySimpleProxy({
  owner,
  implementation,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeploySimpleProxyOptions): Promise<DeployedContract> {
  return await deployContract({
    abi: SimpleProxy__factory.abi,
    args: [owner, implementation],
    bytecode: SimpleProxy__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
