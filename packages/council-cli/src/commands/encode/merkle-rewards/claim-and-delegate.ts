import { MerkleRewards } from "@delvtech/council-artifacts/MerkleRewards";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { decimalsOption } from "../../../options/decimals.js";
import { parseUnits } from "viem";

export default command({
  description: "Encode call data for MerkleRewards.claimAndDelegate",

  options: {
    a: {
      alias: ["amount"],
      description: "The amount of rewards to claim and delegate.",
      type: "string",
      required: true,
    },
    d: decimalsOption,
    D: {
      alias: ["delegate"],
      description:
        "The address to delegate the resulting voting power to if the recipient doesn't already have a delegate.",
      type: "hex",
      required: true,
    },
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
      prompt: "Enter destination address",
    });

    const delegate = await options.delegate({
      prompt: {
        message: "Enter delegate address",
        initial: destination,
      },
    });

    const encoded = encodeFunctionData({
      abi: MerkleRewards.abi,
      fn: "claimAndDelegate",
      args: {
        amount: parseUnits(amount, decimals),
        delegate,
        destination,
        merkleProof,
        totalGrant: parseUnits(totalGrant, decimals),
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
