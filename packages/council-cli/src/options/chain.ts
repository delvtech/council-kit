import { SupportedChain, supportedChains } from "src/utils/chains";
import { Chain } from "viem/chains";
import { requiredOption } from "./utils/requiredOption";

export const chainOption = {
  alias: ["chain"],
  describe: "The chain to target.",
  type: "string",
  default: process.env.CHAIN || "localhost",
} as const;

export async function requiredChain(chainName: string): Promise<Chain> {
  const ensuredChainName = await requiredOption(chainName, {
    name: "chain",
    message: "Select chain",
    type: "select",
    choices: [
      { title: "localhost", value: "localhost" },
      { title: "mainnet", value: "mainnet" },
      { title: "goerli", value: "goerli" },
      { title: "sepolia", value: "sepolia" },
      { title: "optimism", value: "optimism" },
      { title: "arbitrum", value: "arbitrum" },
    ],
  });

  const chain = supportedChains[ensuredChainName as SupportedChain];

  if (!chain) {
    throw new Error(`Unsupported chain: ${ensuredChainName}`);
  }

  return chain;
}
