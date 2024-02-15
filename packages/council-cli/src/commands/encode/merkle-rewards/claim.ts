import { MerkleRewards } from "@delvtech/council-artifacts/MerkleRewards";
import { command } from "clide-js";
import signale from "signale";
import { encodeFunctionData, parseUnits } from "viem";

export default command({
  description: "Encode call data for MerkleRewards.claim",

  options: {
    amount: {
      description: "The amount of rewards to claim",
      type: "string",
      required: true,
    },
    decimals: {
      description:
        "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
      type: "number",
      default: 18,
    },
    "total-grant": {
      description: "The total grant amount",
      type: "string",
      required: true,
    },
    proof: {
      alias: ["merkle-proof"],
      description: "The merkle proof for the claim",
      type: "array",
      required: true,
    },
    recipient: {
      alias: ["destination"],
      description: "The address which will be credited with funds",
      type: "string",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const amount = await options.amount({
      prompt: "Enter amount to claim",
    });

    const totalGrant = await options.totalGrant({
      prompt: "Enter total grant amount",
    });

    const decimals = await options.decimals();

    const proof = await options.proof({
      prompt: "Enter merkle proof",
    });

    const recipient = await options.recipient({
      prompt: "Enter recipient address",
    });

    const encoded = encodeClaim(amount, decimals, totalGrant, proof, recipient);

    signale.success(encoded);
    next(encoded);
  },
});

export function encodeClaim(
  amount: string,
  decimals: number,
  totalGrant: string,
  proof: string[],
  recipient: string,
): string {
  return encodeFunctionData({
    abi: MerkleRewards.abi,
    functionName: "claim",
    args: [
      parseUnits(amount, decimals),
      parseUnits(totalGrant, decimals),
      proof as `0x${string}`[],
      recipient as `0x${string}`,
    ],
  });
}
