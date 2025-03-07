import { LockingVault } from "@delvtech/council-artifacts/LockingVault";
import { encodeFunctionData } from "@delvtech/drift";
import { command } from "clide-js";
import signale from "signale";
import { parseUnits } from "viem";

export default command({
  description: "Encode call data for LockingVault.deposit",

  options: {
    a: {
      alias: ["account", "funded-account"],
      description: "The address to credit this deposit to.",
      type: "hex",
      required: true,
    },
    A: {
      alias: ["amount"],
      description: "The amount of tokens to deposit.",
      type: "string",
      required: true,
    },
    d: {
      alias: ["decimals"],
      description:
        "The decimal precision used by the contract. The amount option will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000.",
      type: "number",
      default: 18,
    },
    D: {
      alias: ["delegate", "first-delegation"],
      description:
        "The address to delegate the resulting voting power to if the account doesn't already have a delegate.",
      type: "hex",
      required: true,
    },
  },

  handler: async ({ options, next }) => {
    const fundedAccount = await options.fundedAccount({
      prompt: "Enter account address",
    });

    const amount = await options.amount({
      prompt: "Enter amount to deposit",
    });

    const decimals = await options.decimals();

    const firstDelegation = await options.firstDelegation({
      prompt: "Enter first delegation address",
    });

    const encoded = encodeFunctionData({
      abi: LockingVault.abi,
      fn: "deposit",
      args: {
        fundedAccount,
        amount: parseUnits(amount, decimals),
        firstDelegation,
      },
    });

    signale.success(encoded);
    next(encoded);
  },
});
