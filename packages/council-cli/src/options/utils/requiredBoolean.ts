import prompts from "prompts";
import { requiredOption } from "./requiredOption";
import { UntypedQuestion } from "./types";

export async function requiredBoolean(
  value: boolean | undefined,
  question: UntypedQuestion,
  options?: prompts.Options,
): Promise<boolean> {
  return requiredOption(
    value,
    {
      active: "yes",
      inactive: "no",
      ...question,
      type: "toggle",
    },
    options,
  );
}
