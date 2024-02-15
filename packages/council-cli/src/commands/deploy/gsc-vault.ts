import { GSCVault } from "@delvtech/council-artifacts/GSCVault";
import { command } from "clide-js";
import signale from "signale";
import { WriteOptions } from "src/reusable-options/writeOptions.js";
import { PrivateKeyAccount, parseUnits } from "viem";
import { Chain } from "viem/chains";
import {
  DeployedContract,
  deployContract,
} from "../../utils/deployContract.js";

export default command({
  description: "Deploy a GSCVault contract",

  options: {
    "core-voting": {
      description: "The address of the CoreVoting contract",
      type: "string",
      required: true,
    },
    bound: {
      alias: ["voting-power-bound"],
      description: "The minimum voting power required to become a member",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision to use. The bound option will be multiplied by (10 ** decimals). For example, if bound is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
    owner: {
      description: "The owner of the contract (e.g., a Timelock contract)",
      type: "string",
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const coreVoting = await options.coreVoting({
      prompt: "Enter CoreVoting address",
    });

    const bound = await options.bound({
      prompt: "Enter voting power bound",
    });

    const decimals = await options.decimals();

    const owner = (await options.owner()) || account.address;

    signale.pending("Deploying GSCVault...");

    const deployData = await deployGSCVault({
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

    signale.success(`GSCVault deployed @ ${deployData.address}`);
    next(deployData);
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
    abi: GSCVault.abi,
    args: [
      coreVoting as `0x${string}`,
      parseUnits(votingPowerBound, decimals),
      owner as `0x${string}`,
    ],
    bytecode: GSCVault.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
