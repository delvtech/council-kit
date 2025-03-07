import { OptimisticGrants } from "@delvtech/council-artifacts/OptimisticGrants";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

export default command({
  description: "Encode call data for a OptimisticGrants.configureGrant",

  options: {
    o: {
      alias: ["owner"],
      description: "The address of the grant owner.",
      type: "hex",
      required: true,
    },
    a: {
      alias: ["amount"],
      description: "The amount of tokens to grant.",
      type: "string",
      required: true,
    },
    d: decimalsOption,
    e: {
      alias: ["expiration"],
      description: "The expiration timestamp (in seconds) of the grant.",
      type: "number",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const owner = await options.owner({
      prompt: "Enter owner address",
    });

    const amount = await options.amount({
      prompt: "Enter amount to grant",
    });

    const decimals = await options.decimals();

    const expiration = await options.expiration({
      prompt: "Enter expiration timestamp (in seconds)",
    });

    const encoded = encodeFunctionData({
      abi: OptimisticGrants.abi,
      fn: "configureGrant",
      args: {
        _amount: parseUnits(amount, decimals),
        _expiration: BigInt(expiration),
        _owner: owner,
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
