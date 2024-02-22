import { LockingVault } from "@delvtech/council-artifacts/LockingVault";
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
  description: "Deploy a VestingVault contract",

  options: {
    token: {
      description: "The address of the ERC20 token contract",
      type: "string",
      required: true,
    },
    lag: {
      alias: ["stale-block-lag"],
      description:
        "The number of blocks before the delegation history is forgotten",
      type: "number",
      required: true,
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const token = await options.token({
      prompt: "Enter token address",
    });

    const lag = await options.lag({
      prompt: "Enter stale block lag",
    });

    signale.pending("Deploying VestingVault...");

    const deployData = await deployVestingVault({
      token,
      staleBlockLag: lag,
      account,
      rpcUrl,
      chain,
      onSubmitted: (txHash) => {
        signale.pending(`VestingVault deployment tx submitted: ${txHash}`);
      },
    });

    signale.success(`VestingVault deployed @ ${deployData.address}`);
    next(deployData);
  },
});

export interface DeployVestingVaultOptions {
  token: string;
  staleBlockLag: number;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployVestingVault({
  token,
  staleBlockLag,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployVestingVaultOptions): Promise<DeployedContract> {
  return deployContract({
    abi: LockingVault.abi,
    args: [token as `0x${string}`, BigInt(staleBlockLag)],
    bytecode: LockingVault.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
