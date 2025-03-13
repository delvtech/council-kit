import { option } from "clide-js";

export const freshDeployOption = option({
  alias: ["fresh-deploy"],
  description: "Deploy all contracts from scratch.",
  type: "boolean",
  default: false,
});
