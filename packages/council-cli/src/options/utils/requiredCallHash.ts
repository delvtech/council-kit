import colors from "colors";
import { requiredArray } from "src/options/utils/requiredArray";
import { requiredOption } from "src/options/utils/requiredOption";
import { createCallHash } from "src/utils/createCallHash";
import { isNotEmptyList } from "src/utils/validation/isNotEmptyList";

export async function requiredCallHash(
  callHash?: string,
  targets?: string[],
  calldatas?: string[],
): Promise<string> {
  let fallbackCallHash: string | undefined;

  if (isNotEmptyList(targets) && isNotEmptyList(calldatas)) {
    fallbackCallHash = createCallHash(targets, calldatas);
  }

  const ensuredCallHash = await requiredOption(callHash || fallbackCallHash, {
    name: "call-hash",
    type: "text",
    message: `Enter call hash ${colors.dim(
      "(Leave blank to create a new hash from targets and call data)",
    )}`,
  });

  if (ensuredCallHash) {
    return ensuredCallHash;
  }

  const ensuredTargets = await requiredArray(targets, {
    name: "targets",
    message: "Enter target addresses",
  }).catch(() => {
    throw new Error(
      "The `targets` option is required if no `call-hash` is provided.",
    );
  });

  const ensuredCalldatas = await requiredArray(calldatas, {
    name: "calldatas",
    message: "Enter call data for each target",
  }).catch(() => {
    throw new Error(
      "The `callData` option is required if no `call-hash` is provided.",
    );
  });

  return createCallHash(ensuredTargets, ensuredCalldatas);
}
