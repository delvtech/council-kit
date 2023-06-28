import prompts from "prompts";
import { requiredOption } from "./requiredOption";
import { UntypedQuestion } from "./types";

export async function requiredSecret(
  value: string | undefined,
  question: UntypedQuestion,
  options?: prompts.Options,
): Promise<string> {
  return requiredOption(
    value,
    {
      validate: Boolean,
      ...question,
      type: "password",
    },
    options,
  );
}
