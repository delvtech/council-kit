import { OptimisticRewards } from "@council/artifacts/OptimisticRewards";
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
  description: "Deploy a OptimisticRewards contract",

  options: {
    owner: {
      alias: ["governance"],
      description: "The contract owner's address (e.g., a Timelock contract)",
      type: "string",
    },
    root: {
      alias: ["starting-root"],
      description: "The starting merkle root",
      type: "string",
      required: true,
    },
    proposer: {
      description: "The address that can propose new roots",
      type: "string",
    },
    revoker: {
      alias: ["challenger"],
      description: "The address that can remove proposed reward roots",
      type: "string",
    },
    token: {
      description: "The address of the ERC20 token to distribute",
      type: "string",
      required: true,
    },
    "locking-vault": {
      description:
        "The address of the locking vault contract that will be used when calling Airdrop.claimAndDelegate()",
      type: "string",
      required: true,
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const owner = (await options.owner()) || account.address;

    const root = await options.root({
      prompt: "Enter starting root",
    });

    const proposer = (await options.proposer()) || owner;

    const revoker = (await options.revoker()) || owner;

    const token = await options.token({
      prompt: "Enter token address",
    });

    const lockingVault = await options.lockingVault({
      prompt: "Enter locking vault address",
    });

    signale.pending("Deploying OptimisticRewards...");

    const deployData = await deployOptimisticRewards({
      owner,
      startingRoot: root,
      proposer,
      revoker,
      token,
      lockingVault,
      account,
      rpcUrl,
      chain,
      onSubmitted: (txHash) => {
        signale.pending(`OptimisticRewards deployment tx submitted: ${txHash}`);
      },
    });

    signale.success(`OptimisticRewards deployed @ ${deployData.address}`);
    next(deployData);
  },
});

export interface DeployOptimisticRewardsOptions {
  owner: string;
  startingRoot: string;
  proposer: string;
  revoker: string;
  token: string;
  lockingVault: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployOptimisticRewards({
  owner,
  startingRoot,
  proposer,
  revoker,
  token,
  lockingVault,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployOptimisticRewardsOptions): Promise<DeployedContract> {
  return deployContract({
    abi: OptimisticRewards.abi,
    args: [
      owner as `0x${string}`,
      startingRoot as `0x${string}`,
      proposer as `0x${string}`,
      revoker as `0x${string}`,
      token as `0x${string}`,
      lockingVault as `0x${string}`,
    ],
    bytecode: OptimisticRewards.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
