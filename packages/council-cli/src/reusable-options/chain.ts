import { Context, OptionConfig, OptionGetter } from "clide-js";
import { Chain, defineChain } from "viem";
import {
  HyphenCase,
  SupportedChain,
  formatChainName,
  supportedChains,
} from "../lib/viem.js";

// TODO: Add a way to register new chains that updates the chain prompt and
// makes it possible to use the custom chain name in environment variables.

export const chainOption = {
  alias: ["chain"],
  description: "The chain to target.",
  type: "string",
  required: true,
  default: process.env.CHAIN || "localhost",
} as const satisfies OptionConfig;

const supportedChainNames = Object.keys(supportedChains);

export async function getChain(
  chainOptionGetter: OptionGetter<string>,
  context?: Context,
): Promise<Chain> {
  const choices = supportedChainNames.map((chainName) => {
    return {
      title: chainName,
      value: chainName,
    };
  });

  if (context) {
    choices.push({
      title: "other",
      value: "other",
    });
  }

  const chosenChain = (await chainOptionGetter({
    prompt: {
      message: "Select chain",
      type: "select",
      choices,
    },
  })) as SupportedChain | "other" | `other:${number}`;

  if (chosenChain in supportedChains) {
    return supportedChains[chosenChain as SupportedChain];
  }

  const id = chosenChain.startsWith("other:")
    ? parseInt(chosenChain.split(":")[1])
    : await context?.client.prompt({
        message: "Enter chain ID",
        type: "number",
      });

  return defineChain({
    id,
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

/** Derive the correct option value from a Chain object. */
export function chainToOptionValue<TChain extends Chain>(
  chain: TChain,
): HyphenCase<TChain["name"]> {
  return formatChainName(chain.name) as HyphenCase<TChain["name"]>;
}
