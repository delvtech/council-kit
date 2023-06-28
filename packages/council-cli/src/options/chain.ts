import {
  SupportedChain,
  supportedChainNames,
  supportedChains,
} from "src/utils/chains";
import { Chain } from "viem/chains";
import { requiredOption } from "./utils/requiredOption";

export const chainOption = {
  alias: ["chain"],
  describe: "The chain to target.",
  type: "string",
  default: process.env.CHAIN,
} as const;

export async function requiredChain(
  chainName: string | undefined,
): Promise<Chain> {
  const ensuredChainName = await requiredOption(chainName, {
    name: "chain",
    message: "Select chain",
    type: "select",
    choices: supportedChainNames.map((chainName) => ({
      title: chainName,
      value: chainName,
    })),
  });

  const chain = supportedChains[ensuredChainName as SupportedChain];

  if (!chain) {
    throw new Error(`Unsupported chain: ${ensuredChainName}`);
  }

  return chain;
}
