import {
  BlockIdentifier,
  Drift,
  MaybePromise,
  RangeBlock,
} from "@delvtech/drift";
import { isHexString } from "src/utils/isHash";

/**
 * Converts a {@linkcode BlockIdentifier} to a {@linkcode RangeBlock} by
 * fetching the block number from the drift instance if the block is a hash.
 */
export function convertToRangeBlock(
  block: BlockIdentifier | undefined,
  drift: Drift,
): MaybePromise<RangeBlock | undefined> {
  if (!block || typeof block === "bigint" || !isHexString(block)) {
    return block;
  }
  return drift.getBlock({ blockHash: block }).then((block) => block?.number);
}
