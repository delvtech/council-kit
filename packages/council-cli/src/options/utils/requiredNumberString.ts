import prompts from "prompts";
import { isNumberString } from "src/utils/validation/isNumberString";
import { requiredOption } from "./requiredOption";
import { UntypedQuestion } from "./types";

export async function requiredNumberString(
  value: string | undefined,
  question: UntypedQuestion,
  options?: prompts.Options,
): Promise<string> {
  return requiredOption(
    value,
    {
      validate: isNumberString,
      ...question,
      type: "text",
    },
    options,
  );
}
