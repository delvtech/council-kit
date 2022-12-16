import prompt from "prompt";
/**
 * Returns a number string from stdin.
 */
export async function promptNumber({
  message,
  defaultNumber,
  max,
}: {
  message: string;
  defaultNumber?: string;
  max?: string;
}): Promise<string> {
  const schema: prompt.RevalidatorSchema = {
    description: message,
    name: "amount",
    pattern: /^\d*\.?\d*$/,
    required: true,
  };

  if (defaultNumber) {
    schema.default = defaultNumber;
  }

  if (max) {
    schema.conform = (value) => Number(value) <= Number(max);
  }

  const { amount } = await prompt.get(schema);
  return amount as string;
}
