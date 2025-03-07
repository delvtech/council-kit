import { option } from "clide-js";

export const ownerOption = option({
  alias: ["owner"],
  description:
    "The contract owner's address (e.g., a Timelock contract). Defaults to the deployer address.",
  type: "hex",
});
