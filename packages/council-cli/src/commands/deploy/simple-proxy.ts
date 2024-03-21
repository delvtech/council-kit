import { SimpleProxy } from "@delvtech/council-artifacts/SimpleProxy";
import { command } from "clide-js";
import signale from "signale";
import { PrivateKeyAccount } from "viem";
import { Chain } from "viem/chains";
import { WriteOptions } from "../../reusable-options/writeOptions.js";
import {
  DeployedContract,
  deployContract,
} from "../../utils/deployContract.js";

export default command({
  description: "Deploy a SimpleProxy contract",

  options: {
    owner: {
      describe: "The contract owner's address (e.g., a Timelock contract)",
      type: "string",
    },
    implementation: {
      alias: ["first-implementation"],
      describe: "The address that calls to the proxy will be forwarded to",
      type: "string",
      required: true,
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;
    const owner = (await options.owner()) || account.address;

    const implementation = await options.implementation({
      prompt: "Enter implementation address",
    });

    signale.pending("Deploying SimpleProxy...");

    const deployData = await deploySimpleProxy({
      owner,
      implementation,
      account,
      rpcUrl,
      chain,
      onSubmitted: (txHash) => {
        signale.pending(`SimpleProxy deployment tx submitted: ${txHash}`);
      },
    });

    signale.success(`SimpleProxy deployed @ ${deployData.address}`);
    return next(deployData);
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
    abi: SimpleProxy.abi,
    args: [owner as `0x${string}`, implementation as `0x${string}`],
    bytecode: SimpleProxy.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
