import prompts from "prompts";

/**
 * make the message property required since prompts throws an error if it's not
 * defined.
 */
export type Question = Omit<prompts.PromptObject, "message" | "onCancel"> & {
  message: NonNullable<prompts.PromptObject["message"]>;
};

export type UntypedQuestion = Omit<Question, "type">;
