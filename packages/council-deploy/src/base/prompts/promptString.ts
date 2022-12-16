import prompt from "prompt";

export async function promptString({
  message,
  defaultValue,
  choices,
}: {
  message: string;
  defaultValue?: string;
  choices?: string[];
}): Promise<string> {
  const schema: prompt.RevalidatorSchema = {
    description: message,
    name: "value",
    type: "string",
    required: true,
  };

  if (defaultValue) {
    schema.default = defaultValue;
  }

  if (choices) {
    schema.enum = choices;
  }

  const { value } = await prompt.get(schema);

  return value as string;
}
