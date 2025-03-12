import { createCouncil } from "@delvtech/council-js";
import { fixed } from "@delvtech/fixed-point-wasm";
import { command } from "clide-js";
import signale from "signale";
import { rpcUrlOption } from "../../options/rpc-url.js";

export default command({
  description: "Get the balance of a given account.",

  options: {
    a: {
      alias: ["address"],
      description: "The LockingVault contract address.",
      type: "string",
      customType: "hex",
      required: true,
    },
    A: {
      alias: ["account"],
      description: "The account to get the balance of.",
      type: "string",
      customType: "hex",
      required: true,
    },
    r: rpcUrlOption,
  },

  handler: async ({ options, next }) => {
    const rpcUrl = await options.rpcUrl({
      prompt: "Enter RPC URL",
    });

    const address = await options.address({
      prompt: "Enter LockingVault contract address",
    });

    const account = await options.account({
      prompt: "Enter account to get balance of",
    });

    const lockingVault = createCouncil({ rpcUrl }).lockingVault(address);
    const token = await lockingVault.getToken();
    const [balance, decimals] = await Promise.all([
      lockingVault.getBalanceOf(account),
      token.getDecimals(),
    ]);
    const formattedBalance = fixed(balance, decimals).format();

    signale.info(formattedBalance);
    next(balance);
  },
});
