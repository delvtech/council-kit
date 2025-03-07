import { Bytes } from "@delvtech/drift";
import { OptionGetter, options } from "clide-js";
import colors from "colors";
import { Address, Hash } from "viem";
import { createCallHash } from "../utils/createCallHash.js";
import { isNotEmptyList } from "../utils/validation/isNotEmptyList.js";

export const callHashOptions = options({
  "call-hash": {
    description: "The hash entry to increase time for.",
    type: "hex",
  },
  targets: {
    description:
      "A list of addresses to call. This will be used with the `--calldatas` option to create a call hash if one isn't provided via the `--call-hash` option.",
    type: "hexArray",
  },
  calldatas: {
    description:
      "Encoded call data for each target. This will be used with the `--targets` option to create a call hash if one isn't provided via the `--call-hash` option.",
    type: "hexArray",
  },
});

export async function getCallHash(
  callHashGetter: OptionGetter<Hash | undefined>,
  targetsGetter: OptionGetter<Address[] | undefined>,
  calldatasGetter: OptionGetter<Bytes[] | undefined>,
): Promise<Hash> {
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
