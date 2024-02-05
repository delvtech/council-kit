import { CoreVoting } from "@council/artifacts/CoreVoting";
import { command } from "clide-js";
import signale from "signale";
import { PrivateKeyAccount, parseUnits } from "viem";
import { Chain } from "viem/chains";
import { WriteOptions } from "../..//reusable-options/write-options.js";
import {
  DeployedContract,
  deployContract,
} from "../../utils/deployContract.js";

export default command({
  description: "Deploy a CoreVoting contract",

  options: {
    o: {
      alias: ["owner", "timelock"],
      description: "The contract owner's address (e.g., a Timelock contract)",
      type: "string",
    },
    q: {
      alias: ["quorum", "base-quorum"],
      description: "The default quorum for proposals",
      type: "string",
      required: true,
    },
    m: {
      alias: ["min-power", "min-proposal-power"],
      description: "The minimum voting power required to create a proposal",
      type: "string",
      required: true,
    },
    d: {
      alias: ["decimals"],
      description:
        "The decimal precision to use. The quorum and power options will be multiplied by (10 ** decimals). For example, if quorum is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
    g: {
      alias: ["gsc"],
      description: "The address of the Governance Steering Committee contract",
      type: "string",
    },
    v: {
      alias: ["vaults", "voting-vaults"],
      description: "The addresses of the approved voting vaults",
      type: "array",
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const owner = (await options.owner()) || account.address;

    const quorum = await options.quorum({
      prompt: "Enter default quorum",
    });

    const minPower = await options.minPower({
      prompt: "Enter minimum proposal power",
    });

    const decimals = await options.decimals();

    const gsc = (await options.gsc()) || owner;

    const vaults =
      (await options.vaults({
        prompt: "Enter approved voting vaults",
      })) || [];

    signale.pending("Deploying CoreVoting...");

    const deployData = await deployCoreVoting({
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

    signale.success(`CoreVoting deployed @ ${deployData.address}`);
    next(deployData);
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
    abi: CoreVoting.abi,
    args: [
      owner as `0x${string}`,
      parseUnits(quorum as `${number}`, decimals),
      parseUnits(minPower as `${number}`, decimals),
      gsc as `0x${string}`,
      vaults as `0x${string}`[],
    ],
    bytecode: CoreVoting.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
