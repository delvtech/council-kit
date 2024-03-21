import { OptionGetter, OptionsConfig } from "clide-js";
import colors from "colors";
import { createCallHash } from "../utils/createCallHash.js";
import { isNotEmptyList } from "../utils/validation/isNotEmptyList.js";

export const callHashOptions = {
  "call-hash": {
    description: "The hash entry to increase time for",
    type: "string",
  },
  targets: {
    description:
      "A list of addresses to call. This will be used with the `--calldatas` option to create a call hash if one isn't provided via the `--call-hash` option.",
    type: "array",
  },
  calldatas: {
    description:
      "Encoded call data for each target. This will be used with the `--targets` option to create a call hash if one isn't provided via the `--call-hash` option.",
    type: "array",
  },
} as const satisfies OptionsConfig;

export async function getCallHash(
  callHashGetter: OptionGetter<string | undefined>,
  targetsGetter: OptionGetter<string[] | undefined>,
  calldatasGetter: OptionGetter<string[] | undefined>,
): Promise<string> {
  let callHash = await callHashGetter();
  if (callHash) {
    return callHash;
  }

  let targets = await targetsGetter();
  let calldatas = await calldatasGetter();
  if (isNotEmptyList(targets) && isNotEmptyList(calldatas)) {
    return createCallHash(targets, calldatas);
  }

  callHash = await callHashGetter({
    prompt: `Enter call hash ${colors.dim(
      "(Leave blank to create a new hash from targets and call data)",
    )}`,
  });
  if (callHash) {
    return callHash;
  }

  targets = await targetsGetter({
    prompt: "Enter target addresses",
  });
  if (!targets) {
    throw new Error(
      "The `targets` option is required if no `call-hash` is provided.",
    );
  }

  calldatas = await calldatasGetter({
    prompt: "Enter call data for each target",
  });

  if (!calldatas) {
    throw new Error(
      "The `callData` option is required if no `call-hash` is provided.",
    );
  }

  return createCallHash(targets, calldatas);
}
