import { SimpleProxy } from "@delvtech/council-artifacts/SimpleProxy";
import { command } from "clide-js";
import { ownerOption } from "../../options/owner.js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy a SimpleProxy contract",

  options: {
    g: {
      ...ownerOption,
      alias: ["governance", ...ownerOption.alias],
    },
    i: {
      alias: ["implementation"],
      describe: "The address that calls to the proxy will be forwarded to.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, deployer } = data as DeployOptions;

    const implementation = await options.implementation({
      prompt: "Enter implementation address",
    });

    const governance = (await options.governance()) || account.address;

    const deployedContract = await deployer.deploy({
      abi: SimpleProxy.abi,
      bytecode: SimpleProxy.bytecode,
      name: "SimpleProxy",
      args: {
        _firstImplementation: implementation,
        _governance: governance,
      },
    });

    next(deployedContract);
  },
});
