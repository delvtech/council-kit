import { OptimisticRewards } from "@delvtech/council-artifacts/OptimisticRewards";
import { command } from "clide-js";
import { ownerOption } from "../../options/owner.js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy a OptimisticRewards contract",

  options: {
    s: {
      alias: ["starting-root"],
      description: "The starting merkle root.",
      type: "hex",
      required: true,
    },
    t: {
      alias: ["token"],
      description: "The address of the ERC20 token to distribute.",
      type: "hex",
      required: true,
    },
    v: {
      alias: ["locking-vault"],
      description:
        "The address of the locking vault contract that will be used when calling Airdrop.claimAndDelegate().",
      type: "hex",
      required: true,
    },
    g: {
      ...ownerOption,
      alias: ["governance", ...ownerOption.alias],
    },
    p: {
      alias: ["proposer"],
      description:
        "The address that can propose new roots. Defaults to governance.",
      type: "hex",
    },
    r: {
      alias: ["revoker"],
      description:
        "The address that can remove proposed reward roots. Defaults to governance.",
      type: "hex",
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, deployer } = data as DeployOptions;

    const root = await options.startingRoot({
      prompt: "Enter starting root",
    });

    const lockingVault = await options.lockingVault({
      prompt: "Enter locking vault address",
    });

    const token = await options.token({
      prompt: "Enter token address",
    });

    const governance = (await options.governance()) || account.address;
    const proposer = (await options.proposer()) || governance;
    const revoker = (await options.revoker()) || governance;

    const deployedContract = await deployer.deploy({
      abi: OptimisticRewards.abi,
      bytecode: OptimisticRewards.bytecode,
      name: "OptimisticRewards",
      args: {
        _token: token,
        _governance: governance,
        _lockingVault: lockingVault,
        _startingRoot: root,
        _proposer: proposer,
        _revoker: revoker,
      },
    });

    next(deployedContract);
  },
});
