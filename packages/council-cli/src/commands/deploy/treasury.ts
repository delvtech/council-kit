import { Treasury } from "@delvtech/council-artifacts/Treasury";
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
  description: "Deploy a Treasury contract",

  options: {
    owner: {
      description: "The contract owner's address (e.g., a Timelock contract)",
      type: "string",
      required: true,
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const owner = (await options.owner()) || account.address;

    signale.pending("Deploying Treasury...");

    const deployData = await deployTreasury({
      owner,
      account,
      rpcUrl,
      chain,
      onSubmitted: (txHash) => {
        signale.pending(`Treasury deployment tx submitted: ${txHash}`);
      },
    });

    signale.success(`Treasury deployed @ ${deployData.address}`);
    next(deployData);
  },
});

export interface DeployTreasuryOptions {
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  owner?: string;
  onSubmitted?: (txHash: string) => void;
}

export async function deployTreasury({
  account,
  rpcUrl,
  chain,
  owner = account.address,
  onSubmitted,
}: DeployTreasuryOptions): Promise<DeployedContract> {
  return await deployContract({
    abi: Treasury.abi,
    args: [owner as `0x${string}`],
    bytecode: Treasury.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
