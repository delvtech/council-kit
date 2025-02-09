import {
  Block,
  ContractReadOptions,
  Drift,
  GetBlockParams,
} from "@delvtech/drift";
import { CouncilSdkError } from "src/error";

export type GetBlockOrThrowParams = GetBlockParams | ContractReadOptions;

/**
 * A utility that tries to fetch a block from a given drift instance and throws
 * an error if no block is found. Useful for unified error handling when
 * fetching blocks that may not exist.
 *
 * @throws {CouncilSdkError}
 */
export async function getBlockOrThrow(
  drift: Drift,
  params?: GetBlockOrThrowParams,
): Promise<Block> {
  let _options: GetBlockParams = {};

  // If given contract read options, extract the block options
  if (params && "block" in params) {
    // The `block` option can either be a block number or a block tag
    if (typeof params.block === "bigint") {
      _options.blockNumber = params.block;
    } else {
      _options.blockTag = params.block;
    }
  } else {
    // Otherwise, use the params as the block options
    _options = params as GetBlockParams;
  }

  const block = await drift.getBlock(_options);

  if (!block) {
    const blockLabel =
      _options?.blockHash ?? _options?.blockNumber ?? _options?.blockTag;
    throw new CouncilSdkError(
      `Block${blockLabel !== undefined ? ` ${blockLabel}` : ""} not found`,
    );
  }

  return block;
}
