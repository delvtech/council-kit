import colors from "colors";
import prompts from "prompts";
import { isNotEmptyList } from "src/utils/validation/isNotEmptyList";
import { requiredOption } from "./requiredOption";
import { UntypedQuestion } from "./types";

export type ArrayQuestion = Omit<UntypedQuestion, "separator">;

export async function requiredArray<T extends string>(
  value: T[] | undefined,
  question: ArrayQuestion,
  options?: prompts.Options,
): Promise<T[]> {
  return requiredOption(
    value,
    {
      ...question,
      validate: (_value, ...passthroughArgs) => {
        let value = _value;

        // The value is a string if it was captured from the prompt.
        if (typeof value === "string") {
          value = value.split(" ");
        }

        if (question.validate) {
          return question.validate(value, ...passthroughArgs);
        }

        return isNotEmptyList(value);
      },
      type: "list",
      separator: " ",
      message: `${question.message} ${colors.dim("(space separated)")}`,
    },
    options,
  );
}
