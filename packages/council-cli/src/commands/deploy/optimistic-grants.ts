import { OptimisticGrants } from "@delvtech/council-artifacts/OptimisticGrants";
import { command } from "clide-js";
import { ownerOption } from "../../options/owner.js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy an OptimisticGrants contract",

  options: {
    t: {
      alias: ["token"],
      description: "The address of the ERC20 token to distribute.",
      type: "string",
      customType: "hex",
      required: true,
    },
    g: {
      ...ownerOption,
      alias: ["governance", ...ownerOption.alias],
    },
  },
  handler: async ({ data, options, next }) => {
    const { account, deployer } = data as DeployOptions;

    const token = await options.token({
      prompt: "Enter token address",
    });

    const governance = await options.governance({
      prompt: "Enter governance address (e.g., a Timelock contract)",
    });

    const deployedContract = await deployer.deploy({
      abi: OptimisticGrants.abi,
      bytecode: OptimisticGrants.bytecode,
      name: "OptimisticGrants",
      args: {
        _token: token,
        __governance: governance || account.address,
      },
    });

    next(deployedContract);
  },
});
