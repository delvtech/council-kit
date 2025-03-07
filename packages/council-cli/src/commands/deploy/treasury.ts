import { Treasury } from "@delvtech/council-artifacts/Treasury";
import { command } from "clide-js";
import { ownerOption } from "../../options/owner.js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy a Treasury contract",

  options: {
    g: {
      ...ownerOption,
      alias: ["governance", ...ownerOption.alias],
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, deployer } = data as DeployOptions;

    const governance = (await options.owner()) || account.address;

    const deployedContract = await deployer.deploy({
      abi: Treasury.abi,
      bytecode: Treasury.bytecode,
      name: "Treasury",
      args: {
        __governance: governance,
      },
    });

    next(deployedContract);
  },
});
