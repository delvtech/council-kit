import { Airdrop } from "@council/artifacts/Airdrop";
import { command } from "clide-js";
import signale from "signale";
import { PrivateKeyAccount } from "viem";
import { Chain } from "viem/chains";
import { WriteOptions } from "../../reusable-options/write-options.js";
import {
  DeployedContract,
  deployContract,
} from "../../utils/deployContract.js";

export default command({
  description: "Deploy an Airdrop contract",

  options: {
    o: {
      alias: ["owner", "governance"],
      description: "The contract owner's address (e.g., a Timelock contract)",
      type: "string",
    },
    r: {
      alias: ["root", "merkle-root"],
      description: "The merkle root of the airdrop",
      type: "string",
      required: true,
    },
    t: {
      alias: ["token"],
      description: "The address of the ERC20 token contract",
      type: "string",
      required: true,
    },
    v: {
      alias: ["locking-vault"],
      description:
        "The address of the locking vault contract that will be used when calling OptimisticRewards.claimAndDelegate()",
      type: "string",
      required: true,
    },
    e: {
      alias: ["expiration"],
      description:
        "The expiration timestamp (in seconds) after which the funds can be reclaimed by the owner",
      type: "number",
      required: true,
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const owner = (await options.owner()) || account.address;

    const root = await options.root({
      prompt: "Enter merkle root",
    });

    const token = await options.token({
      prompt: "Enter token address",
    });

    const lockingVault = await options.lockingVault({
      prompt: "Enter locking vault address",
    });

    const expiration = await options.expiration({
      prompt: "Enter expiration timestamp (in seconds)",
    });

    signale.pending("Deploying Airdrop...");

    const deployData = await deployAirDrop({
      owner,
      merkleRoot: root,
      token,
      expiration,
      lockingVault,
      account,
      rpcUrl,
      chain,
      onSubmitted: (txHash) => {
        signale.pending(`Airdrop deployment tx submitted: ${txHash}`);
      },
    });

    signale.success(`Airdrop deployed @ ${deployData.address}`);
    next(deployData);
  },
});

export interface DeployAirDropOptions {
  owner: string;
  merkleRoot: string;
  token: string;
  expiration: number;
  lockingVault: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployAirDrop({
  owner,
  merkleRoot,
  token,
  expiration,
  lockingVault,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployAirDropOptions): Promise<DeployedContract> {
  return deployContract({
    abi: Airdrop.abi,
    args: [
      owner as `0x${string}`,
      merkleRoot as `0x${string}`,
      token as `0x${string}`,
      BigInt(expiration),
      lockingVault as `0x${string}`,
    ],
    bytecode: Airdrop.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
