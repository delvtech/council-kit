import { GSCVault } from "@delvtech/council-artifacts/GSCVault";
import { command } from "clide-js";
import { parseEther } from "viem";
import { ownerOption } from "../../options/owner.js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy a GSCVault contract",

  options: {
    c: {
      alias: ["core-voting"],
      description: "The address of the CoreVoting contract.",
      type: "hex",
      required: true,
    },
    b: {
      alias: ["voting-power-bound"],
      description:
        "The minimum voting power required to become a member as a decimal string.",
      type: "string",
      required: true,
    },
    o: ownerOption,
  },

  handler: async ({ data, options, next }) => {
    const { account, deployer } = data as DeployOptions;

    const coreVoting = await options.coreVoting({
      prompt: "Enter CoreVoting address",
    });

    const votingPowerBound = await options.votingPowerBound({
      prompt: "Enter voting power bound",
    });

    const owner = (await options.owner()) || account.address;

    const deployedContract = deployer.deploy({
      abi: GSCVault.abi,
      bytecode: GSCVault.bytecode,
      name: "GSCVault",
      args: {
        _coreVoting: coreVoting,
        _votingPowerBound: parseEther(votingPowerBound),
        _owner: owner,
      },
    });

    next(deployedContract);
  },
});
