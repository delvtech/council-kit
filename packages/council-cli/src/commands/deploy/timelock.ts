import { Timelock } from "@delvtech/council-artifacts/Timelock";
import { command } from "clide-js";
import { ownerOption } from "../../options/owner.js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy a Timelock contract",

  options: {
    t: {
      alias: ["wait-time"],
      description:
        "The time (in seconds) to wait until a proposal can be executed.",
      type: "number",
      required: true,
    },
    gsc: {
      description: "The address of the GSC contract.",
      type: "hex",
      required: true,
    },
    g: {
      ...ownerOption,
      alias: ["governance", ...ownerOption.alias],
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, deployer } = data as DeployOptions;

    const waitTime = await options.waitTime({
      prompt: "Enter wait time (in seconds)",
    });

    const gsc = await options.gsc({
      prompt: "Enter GSC address",
    });

    const governance = (await options.governance()) || account.address;

    const deployedContract = await deployer.deploy({
      abi: Timelock.abi,
      bytecode: Timelock.bytecode,
      name: "Timelock",
      args: {
        _waitTime: BigInt(waitTime),
        _gsc: gsc,
        _governance: governance,
      },
    });

    next(deployedContract);
  },
});
