import prompts from "prompts";
import { Question } from "./types";

/**
 * A wrapper around `prompts` which takes a value and prompts the user if it's
 * undefined. It will return the value from the prompt rather than prompt's
 * `Answer` object and throws an error if the prompt is canceled.
 */
export async function requiredOption<T>(
  value: T | undefined,
  question: Question,
  options?: prompts.Options,
): Promise<T> {
  if (
    (!question.validate || question.validate(value, {}, question)) &&
    value !== undefined
  ) {
    return value as T;
  }

  const optionName = question.name as string;

  const result = await prompts(question, {
    ...options,
    onCancel: () => {
      throw new Error(`Option \`${optionName}\` is required.`);
    },
  });

  return result[optionName];
}
