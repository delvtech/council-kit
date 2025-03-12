import { Spender } from "@delvtech/council-artifacts/Spender";
import { command } from "clide-js";
import { parseUnits } from "viem";
import { ownerOption } from "../../options/owner.js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy a Spender contract",

  options: {
    t: {
      alias: ["token"],
      description: "The address of the ERC20 token contract.",
      type: "string",
      customType: "hex",
      required: true,
    },
    s: {
      alias: ["small-spend-limit"],
      description: "The small spend proposal limit as a decimal string.",
      type: "string",
      required: true,
    },
    m: {
      alias: ["medium-spend-limit"],
      description: "The medium spend proposal limit as a decimal string.",
      type: "string",
      required: true,
    },
    h: {
      alias: ["high-spend-limit"],
      description: "The high spend proposal limit as a decimal string.",
      type: "string",
      required: true,
    },
    o: ownerOption,
    S: {
      alias: ["spender"],
      description:
        "The first address authorized to spend tokens. Defaults to the owner.",
      type: "string",
      customType: "hex",
    },
  },

  handler: async ({ data, options, next }) => {
    const { council, account, deployer } = data as DeployOptions;

    const token = await options.token({
      prompt: "Enter token address",
    });

    const small = await options.smallSpendLimit({
      prompt: "Enter small spend limit",
    });

    const medium = await options.mediumSpendLimit({
      prompt: "Enter medium spend limit",
    });

    const high = await options.highSpendLimit({
      prompt: "Enter high spend limit",
    });

    const owner = (await options.owner()) || account.address;
    const spender = (await options.spender()) || owner;
    const decimals = await council.token(token).getDecimals();

    const deployedContract = await deployer.deploy({
      abi: Spender.abi,
      bytecode: Spender.bytecode,
      name: "Spender",
      args: {
        _highSpendLimit: parseUnits(high, decimals),
        _mediumSpendLimit: parseUnits(medium, decimals),
        _smallSpendLimit: parseUnits(small, decimals),
        _token: token,
        _owner: owner,
        _spender: spender,
      },
    });

    next(deployedContract);
  },
});
