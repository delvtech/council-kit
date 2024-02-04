import { Block, Network } from "@council/evm-client";
import { BlockLike, blockToReadOptions } from "src/utils/blockToReadOptions";
import { BlockNotFoundError } from "src/errors/BlockNotFound";

/**
 * A utility that tries to fetch a block from a given network and throws an
 * error if no block is found.
 * @throws `BlockNotFoundError`
 */
export async function getBlock(
  network: Network,
  block?: BlockLike,
): Promise<Block> {
  const fetched = await network.getBlock(blockToReadOptions(block));
  if (!fetched) {
    throw new BlockNotFoundError(block);
  }
  return fetched;
}
