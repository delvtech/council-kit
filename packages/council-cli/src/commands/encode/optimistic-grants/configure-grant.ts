import { OptimisticGrants } from "@council/artifacts/OptimisticGrants";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for a OptimisticGrants.configureGrant",

  options: {
    owner: {
      description: "The address of the grant owner",
      type: "string",
      required: true,
    },
    amount: {
      description: "The amount of tokens to grant",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
    expiration: {
      description: "The expiration timestamp (in seconds) of the grant",
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

    const encoded = encodeConfigureGrant(owner, amount, decimals, expiration);
    signale.success(encoded);
    next(encoded);
  },
});

export function encodeConfigureGrant(
  owner: string,
  amount: string,
  decimals: number,
  expiration: number,
): string {
  return encodeFunctionData({
    abi: OptimisticGrants.abi,
    functionName: "configureGrant",
    args: [
      owner as `0x${string}`,
      parseUnits(amount, decimals),
      BigInt(expiration),
    ],
  });
}
