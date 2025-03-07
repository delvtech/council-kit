import { MockERC20 } from "@delvtech/council-artifacts/MockERC20";
import { command } from "clide-js";
import { ownerOption } from "../../options/owner.js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy a MockERC20 contract for use as a mock voting token",

  options: {
    n: {
      alias: ["name"],
      description: "The name of the token.",
      type: "string",
      required: true,
    },
    s: {
      alias: ["symbol"],
      description: "The symbol of the token.",
      type: "string",
      required: true,
    },
    o: ownerOption,
  },

  handler: async ({ data, options, next }) => {
    const { account, deployer } = data as DeployOptions;

    const name = await options.name({
      prompt: "Enter token name",
    });

    const symbol = await options.symbol({
      prompt: "Enter token symbol",
    });

    const owner = await options.owner();

    const deployedContract = await deployer.deploy({
      name: "MockERC20",
      abi: MockERC20.abi,
      bytecode: MockERC20.bytecode,
      args: {
        name_: name,
        symbol_: symbol,
        owner_: owner || account.address,
      },
    });

    next(deployedContract);
  },
});
