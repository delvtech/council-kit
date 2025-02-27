import { BlockIdentifier, Drift, MaybePromise } from "@delvtech/drift";

/**
 * Converts a {@linkcode BlockIdentifier} to a block number by
 * fetching it from the drift instance if it's not already a number.
 */
export function convertToBlockNumber(
  block: BlockIdentifier | undefined,
  drift: Drift,
): MaybePromise<bigint | undefined> {
  if (typeof block === "bigint") {
    return block;
  }
  return drift.getBlock(block).then((block) => block?.number);
}
