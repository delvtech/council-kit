import { option } from "clide-js";

export const decimalsOption = option({
  alias: ["decimals"],
  type: "number",
  description: "The decimals to parse decimal string options with.",
  default: 18,
  required: true,
});
