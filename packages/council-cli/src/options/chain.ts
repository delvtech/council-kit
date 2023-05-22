import { SupportedChain } from "src/utils/getChain";
import { requiredOption } from "./utils/requiredOption";

export const chainOption = {
  alias: ["chain"],
  describe: "The chain to target.",
  type: "string",
  default: (process.env.CHAIN || "localhost") as SupportedChain,
} as const;

export async function requiredChain(
  value: SupportedChain | undefined,
): Promise<SupportedChain> {
  return requiredOption<SupportedChain>(value, {
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
}
