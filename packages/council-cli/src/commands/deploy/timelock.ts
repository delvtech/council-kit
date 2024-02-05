import { Timelock } from "@council/artifacts/Timelock";
import { command } from "clide-js";
import signale from "signale";
import { WriteOptions } from "src/reusable-options/write-options.js";
import { PrivateKeyAccount } from "viem";
import { Chain } from "viem/chains";
import {
  DeployedContract,
  deployContract,
} from "../../utils/deployContract.js";

export default command({
  description: "Deploy a Timelock contract",

  options: {
    t: {
      alias: ["time", "wait-time", "waitTime"],
      description:
        "The time (in seconds) to wait until a proposal can be executed",
      type: "number",
      required: true,
    },
    o: {
      alias: ["owner"],
      description: "The contract owner's address (e.g., a CoreVoting contract)",
      type: "string",
    },
    g: {
      alias: ["gsc"],
      description: "The address of the GSC contract",
      type: "string",
      required: true,
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const time = await options.time({
      prompt: "Enter wait time (in seconds)",
    });

    const owner = (await options.owner()) || account.address;

    const gsc = await options.gsc({
      prompt: "Enter GSC address",
    });

    signale.pending("Deploying Timelock...");

    const deployData = await deployTimelock({
      waitTime: time,
      owner,
      gsc,
      account,
      rpcUrl,
      chain,
      onSubmitted: (txHash) => {
        signale.pending(`Timelock deployment tx submitted: ${txHash}`);
      },
    });

    signale.success(`Timelock deployed @ ${deployData.address}`);
    next(deployData);
  },
});

export interface DeployTimelockOptions {
  waitTime: number;
  gsc: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  owner?: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployTimelock({
  waitTime,
  gsc,
  account,
  rpcUrl,
  chain,
  owner = account.address,
  onSubmitted,
}: DeployTimelockOptions): Promise<DeployedContract> {
  return await deployContract({
    abi: Timelock.abi,
    args: [BigInt(waitTime), owner as `0x${string}`, gsc as `0x${string}`],
    bytecode: Timelock.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
