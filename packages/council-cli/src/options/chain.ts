import { Client, option, OptionGetter } from "clide-js";
import { Chain, defineChain } from "viem";
import { ConfiguredChain, configuredChains } from "../lib/viem.js";

export const chainOption = option({
  alias: ["chain"],
  description: "The chain to target.",
  type: "string",
  required: true,
  default: process.env.CHAIN || "localhost",
  choices: [...Object.keys(configuredChains), "other"],
});

export async function getChain(
  chainOptionGetter: OptionGetter<string>,
  client = new Client(),
): Promise<Chain> {
  const chosenChain = (await chainOptionGetter({
    prompt: "Select chain",
  })) as ConfiguredChain | "other" | `other:${number}`;

  if (chosenChain in configuredChains) {
    return configuredChains[chosenChain as ConfiguredChain];
  }

  const id = chosenChain.startsWith("other:")
    ? parseInt(chosenChain.split(":")[1])
    : await client.prompt({
        message: "Enter chain ID",
        type: "number",
        validate: (value) => !!value,
      });

  return defineChain({
    id: id || 0,
    name: chosenChain,
    network: "other",
    nativeCurrency: {
      decimals: 18,
      name: "Native Currency",
      symbol: "VALUE",
    },
    rpcUrls: {
      default: { http: [] },
      public: { http: [] },
    },
  });
}
