import { CoreVoting } from "@delvtech/council-artifacts/CoreVoting";
import { command } from "clide-js";
import { parseEther } from "viem";
import { ownerOption } from "../../options/owner.js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy a CoreVoting contract",

  options: {
    t: {
      ...ownerOption,
      alias: ["timelock", ...ownerOption.alias],
    },
    q: {
      alias: ["quorum"],
      description:
        "The minimum voting power required for a proposal to pass as a decimal string.",
      type: "string",
      required: true,
    },
    p: {
      alias: ["min-proposal-power"],
      description:
        "The minimum voting power required to create a proposal as a decimal string.",
      type: "string",
      required: true,
    },
    g: {
      alias: ["gsc"],
      description: "The address of the Governance Steering Committee contract.",
      type: "hex",
    },
    v: {
      alias: ["vaults"],
      description: "The addresses of the approved voting vaults",
      type: "hexArray",
      default: [],
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, deployer } = data as DeployOptions;

    const timelock = (await options.timelock()) || account.address;

    const quorum = await options.quorum({
      prompt: "Enter default quorum",
    });

    const minProposalPower = await options.minProposalPower({
      prompt: "Enter minimum proposal power",
    });

    const gsc = (await options.gsc()) || timelock;

    const maybeVaults = await options.vaults({
      prompt: "Enter approved voting vaults",
    });
    const vaults = maybeVaults?.filter((v) => !!v) || [];

    const deployedContract = deployer.deploy({
      abi: CoreVoting.abi,
      bytecode: CoreVoting.bytecode,
      name: "CoreVoting",
      args: {
        _baseQuorum: parseEther(quorum),
        _minProposalPower: parseEther(minProposalPower),
        _gsc: gsc,
        _timelock: timelock,
        votingVaults: vaults,
      },
    });

    next(deployedContract);
  },
});
