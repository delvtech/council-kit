import { MerkleRewards } from "@delvtech/council-artifacts/MerkleRewards";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";
import { decimalsOption } from "../../../options/decimals.js";

export default command({
  description: "Encode call data for MerkleRewards.claim",

  options: {
    a: {
      alias: ["amount"],
      description: "The amount of rewards to claim",
      type: "string",
      required: true,
    },
    d: decimalsOption,
    g: {
      alias: ["total-grant"],
      description: "The total grant amount.",
      type: "string",
      required: true,
    },
    p: {
      alias: ["merkle-proof"],
      description: "The merkle proof for the claim.",
      type: "hexArray",
      required: true,
    },
    r: {
      alias: ["recipient", "destination"],
      description: "The address which will be credited with funds.",
      type: "hex",
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

    const merkleProof = await options.merkleProof({
      prompt: "Enter merkle proof",
    });

    const destination = await options.destination({
      prompt: "Enter recipient address",
    });

    const encoded = encodeFunctionData({
      abi: MerkleRewards.abi,
      fn: "claim",
      args: {
        amount: parseUnits(amount, decimals),
        destination,
        merkleProof,
        totalGrant: parseUnits(totalGrant, decimals),
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
