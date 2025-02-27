import {
  BlockIdentifier,
  Drift,
  isHexString,
  MaybePromise,
  RangeBlock,
} from "@delvtech/drift";

/**
 * Converts a {@linkcode BlockIdentifier} to a {@linkcode RangeBlock} by
 * fetching the block number from the drift instance if the block is a hash.
 */
export function convertToRangeBlock(
  block: BlockIdentifier | undefined,
  drift: Drift,
): MaybePromise<RangeBlock | undefined> {
  if (isHexString(block)) {
    return drift.getBlock(block).then((block) => block?.number);
  }
  return block;
}
