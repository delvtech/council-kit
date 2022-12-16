import prompt from "prompt";
export async function promptYesNo({
  message,
}: {
  message: string;
}): Promise<boolean> {
  const schema: prompt.RevalidatorSchema = {
    description: `${message} [y/n]`,
    name: "yesNo",
    pattern: /y[es]*|n[o]?/,
    required: true,
  };

  const { yesNo } = await prompt.get(schema);

  if ((yesNo as string)[0].toLowerCase() === "y") {
    return true;
  }

  return false;
}
