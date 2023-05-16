import { MerkleRewards__factory } from "@council/typechain";
import signale from "signale";
import { requiredArray } from "src/options/utils/requiredArray";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { encodeFunctionData } from "viem";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "claim-and-delegate [OPTIONS]",
    aliases: ["claimAndDelegate"],
    describe: "Encode call data for MerkleRewards.claimAndDelegate",

    builder: (yargs) => {
      return yargs.options({
        a: {
          alias: ["amount"],
          describe: "The amount of rewards to claim and delegate",
          type: "string",
        },
        p: {
          alias: ["decimals"],
          describe:
            "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
        d: {
          alias: ["delegate"],
          describe:
            "The address to delegate the resulting voting power to if the recipient doesn't already have a delegate",
          type: "string",
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

      const delegate = await requiredString(args.delegate, {
        name: "delegate",
        message: "Enter delegate address",
      });

      signale.success(
        encodeClaimAndDelegate(
          amount,
          decimals,
          delegate,
          totalGrant,
          proof,
          recipient,
        ),
      );
    },
  });

export function encodeClaimAndDelegate(
  amount: string,
  decimals: number,
  delegate: string,
  totalGrant: string,
  proof: string[],
  recipient: string,
): string {
  return encodeFunctionData({
    abi: MerkleRewards__factory.abi,
    functionName: "claimAndDelegate",
    args: [
      parseBigInt(amount, decimals),
      delegate,
      parseBigInt(totalGrant, decimals),
      proof,
      recipient,
    ],
  });
}
