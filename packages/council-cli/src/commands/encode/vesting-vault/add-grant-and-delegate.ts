import { VestingVault } from "@delvtech/council-artifacts/VestingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

export default command({
  description: "Encode call data for VestingVault.addGrantAndDelegate",

  options: {
    w: {
      alias: ["who", "address"],
      description: "The grant recipient",
      type: "hex",
      required: true,
    },
    a: {
      alias: ["amount"],
      description: "The total grant value.",
      type: "string",
      required: true,
    },
    d: decimalsOption,
    t: {
      alias: ["start-time"],
      description:
        "An optional non standard start time (in seconds). If set to zero then the start time will be made the block this is executed in.",
      type: "number",
      default: 0,
    },
    e: {
      alias: ["expiration"],
      description:
        "The timestamp (in seconds) when the grant ends and all tokens are unlocked.",
      type: "number",
      required: true,
    },
    c: {
      alias: ["cliff"],
      description:
        "The timestamp (in seconds) when the grant begins vesting. No tokens will be unlocked until this timestamp has been reached.",
      type: "number",
      required: true,
    },
    D: {
      alias: ["delegate", "delegatee"],
      description:
        "The address to delegate the resulting voting power to if the recipient doesn't already have a delegate.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const who = await options.who({
      prompt: "Enter recipient address",
    });

    const amount = await options.amount({
      prompt: "Enter total grant amount",
    });

    const decimals = await options.decimals();

    const startTime = await options.startTime();

    const expiration = await options.expiration({
      prompt: "Enter expiration timestamp (in seconds)",
    });

    const cliff = await options.cliff({
      prompt: "Enter cliff timestamp (in seconds)",
    });

    const delegatee = await options.delegatee({
      prompt: "Enter delegatee address",
    });

    const encoded = encodeFunctionData({
      abi: VestingVault.abi,
      fn: "addGrantAndDelegate",
      args: {
        _amount: parseUnits(amount, decimals),
        _cliff: BigInt(cliff),
        _delegatee: delegatee,
        _expiration: BigInt(expiration),
        _startTime: BigInt(startTime),
        _who: who,
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
