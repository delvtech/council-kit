import { LockingVault } from "@delvtech/council-artifacts/LockingVault";
import { command } from "clide-js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy a VestingVault contract",

  options: {
    t: {
      alias: ["token"],
      description: "The address of the ERC20 token contract.",
      type: "string",
      customType: "hex",
      required: true,
    },
    l: {
      alias: ["stale-block-lag"],
      description:
        "The number of blocks before the delegation history is forgotten.",
      type: "number",
      required: true,
    },
  },

  handler: async ({ data, options, next }) => {
    const { deployer } = data as DeployOptions;

    const token = await options.token({
      prompt: "Enter token address",
    });

    const staleBlockLag = await options.staleBlockLag({
      prompt: "Enter stale block lag",
    });

    const deployedContract = await deployer.deploy({
      abi: LockingVault.abi,
      bytecode: LockingVault.bytecode,
      name: "LockingVault",
      args: {
        _staleBlockLag: BigInt(staleBlockLag),
        _token: token,
      },
    });

    next(deployedContract);
  },
});
