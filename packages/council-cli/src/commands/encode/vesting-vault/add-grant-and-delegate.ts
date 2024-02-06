import { VestingVault } from "@council/artifacts/VestingVault";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for VestingVault.addGrantAndDelegate",

  options: {
    who: {
      alias: ["address"],
      description: "The grant recipient",
      type: "string",
      required: true,
    },
    amount: {
      description: "The total grant value",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
    "start-time": {
      description:
        "An optional non standard start time (in seconds). If set to zero then the start time will be made the block this is executed in",
      type: "number",
      default: 0,
    },
    expiration: {
      description:
        "The timestamp (in seconds) when the grant ends and all tokens are unlocked",
      type: "number",
      required: true,
    },
    cliff: {
      description:
        "The timestamp (in seconds) when the grant begins vesting. No tokens will be unlocked until this timestamp has been reached",
      type: "number",
      required: true,
    },
    delegate: {
      description:
        "The address to delegate the resulting voting power to if the recipient doesn't already have a delegate",
      type: "string",
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

    const delegate = await options.delegate({
      prompt: "Enter delegate address",
    });

    const encoded = encodeAddGrantAndDelegate({
      who,
      amount,
      decimals,
      startTime,
      expiration,
      cliff,
      delegate,
    });

    signale.success(encoded);
    next(encoded);
  },
});

interface EncodeAddGrantAndDelegateOptions {
  who: string;
  amount: string;
  decimals: number;
  expiration: number;
  cliff: number;
  delegate: string;
  startTime?: number;
}

export function encodeAddGrantAndDelegate({
  who,
  amount,
  decimals,
  startTime = 0,
  expiration,
  cliff,
  delegate,
}: EncodeAddGrantAndDelegateOptions): string {
  return encodeFunctionData({
    abi: VestingVault.abi,
    functionName: "addGrantAndDelegate",
    args: [
      who as `0x${string}`,
      parseUnits(amount, decimals),
      BigInt(startTime),
      BigInt(expiration),
      BigInt(cliff),
      delegate as `0x${string}`,
    ],
  });
}
