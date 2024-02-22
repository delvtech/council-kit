import { OptionConfig } from "clide-js";

export const freshDeployOption = {
  alias: ["fresh-deploy"],
  description: "Deploy all contracts from scratch.",
  type: "boolean",
  default: false,
} as const satisfies OptionConfig;
