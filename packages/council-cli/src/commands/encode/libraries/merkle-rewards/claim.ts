import { MerkleRewards__factory } from "@council/typechain";
import signale from "signale";
import { requiredArray } from "src/options/utils/requiredArray";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, describe, builder, handler } = createCommandModule({
  command: "claim [OPTIONS]",
  describe: "Encode call data for MerkleRewards.claim",

  builder: (yargs) => {
    return yargs.options({
      a: {
        alias: ["amount"],
        describe: "The amount of rewards to claim",
        type: "string",
      },
      d: {
        alias: ["decimals"],
        describe:
          "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
        type: "number",
      },
      t: {
        alias: ["total-grant", "totalGrant"],
        describe: "The total grant amount",
        type: "string",
      },
      m: {
        alias: ["proof", "merkle-proof", "merkleProof"],
        describe: "The merkle proof for the claim",
        type: "array",
        string: true,
      },
      r: {
        alias: ["recipient", "destination"],
        describe: "The address which will be credited with funds",
        type: "string",
      },
    });
  },

  handler: async (args) => {
    const amount = await requiredString(args.amount, {
      name: "amount",
      message: "Enter amount to claim",
    });

    const totalGrant = await requiredString(args.totalGrant, {
      name: "totalGrant",
      message: "Enter total grant amount",
    });

    const decimals = await requiredNumber(args.decimals, {
      name: "decimals",
      message: "Enter decimal precision",
      initial: 18,
    });

    const proof = await requiredArray(args.proof, {
      name: "proof",
      message: "Enter merkle proof",
    });

    const recipient = await requiredString(args.recipient, {
      name: "recipient",
      message: "Enter recipient address",
    });

    signale.success(
      encodeClaim(amount, decimals, totalGrant, proof, recipient),
    );
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
    abi: MerkleRewards__factory.abi,
    functionName: "claim",
    args: [
      parseBigInt(amount, decimals),
      parseBigInt(totalGrant, decimals),
      proof,
      recipient,
    ],
  });
}
