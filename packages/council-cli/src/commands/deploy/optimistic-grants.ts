import { OptimisticGrants } from "@council/artifacts/OptimisticGrants";
import { command } from "clide-js";
import signale from "signale";
import { WriteOptions } from "src/reusable-options/writeOptions.js";
import { PrivateKeyAccount } from "viem";
import { Chain } from "viem/chains";
import {
  DeployedContract,
  deployContract,
} from "../../utils/deployContract.js";

export default command({
  description: "Deploy an OptimisticGrants contract",

  options: {
    token: {
      description: "The address of the ERC20 token to distribute",
      type: "string",
      required: true,
    },
    governance: {
      description:
        "The governance contract's address for ACL (e.g., a Timelock contract)",
      type: "string",
      required: true,
    },
  },
  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const token = await options.token({
      prompt: "Enter token address",
    });

    const governance = await options.governance({
      prompt: "Enter governance address (e.g., a Timelock contract)",
    });

    signale.pending("Deploying OptimisticGrants...");

    const deployData = await deployOptimisticGrants({
      token,
      governance,
      account,
      rpcUrl,
      chain,
      onSubmitted: (txHash) => {
        signale.pending(`OptimisticGrants deployment tx submitted: ${txHash}`);
      },
    });

    signale.success(`OptimisticGrants deployed @ ${deployData.address}`);
    next(deployData);
  },
});

export interface DeployOptimisticGrantsOptions {
  token: string;
  governance: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployOptimisticGrants({
  token,
  governance,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployOptimisticGrantsOptions): Promise<DeployedContract> {
  return deployContract({
    abi: OptimisticGrants.abi,
    args: [token as `0x${string}`, governance as `0x${string}`],
    bytecode: OptimisticGrants.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
