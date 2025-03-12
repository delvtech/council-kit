import { Treasury } from "@delvtech/council-artifacts/Treasury";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

const ETH_CONSTANT = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export default command({
  description: "Encode call data for Treasury.sendFunds",

  options: {
    t: {
      alias: ["token"],
      description: `The address of token to send (${ETH_CONSTANT} to send ETH).`,
      type: "string",
      customType: "hex",
      required: true,
    },
    a: {
      alias: ["amount"],
      description: "The amount to send.",
      type: "string",
      required: true,
    },
    d: decimalsOption,
    r: {
      alias: ["recipient"],
      description: "The address to send the funds to.",
      type: "string",
      customType: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const token = await options.token({
      prompt: {
        message: "Enter token address",
        initial: ETH_CONSTANT,
      },
    });

    const amount = await options.amount({
      prompt: "Enter amount to send",
    });

    const decimals = await options.decimals();

    const recipient = await options.recipient({
      prompt: "Enter recipient address",
    });

    const encoded = encodeFunctionData({
      abi: Treasury.abi,
      fn: "sendFunds",
      args: {
        _amount: parseUnits(amount, decimals),
        _recipient: recipient,
        _token: token,
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
