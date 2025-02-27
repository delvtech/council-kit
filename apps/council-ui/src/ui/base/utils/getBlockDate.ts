import { BlockIdentifier } from "@delvtech/drift";
import { getDrift } from "src/lib/drift";

const blockTime = 12n;

/**
 * Get the date of a mined block or estimate the date of a future block.
 */
export async function getBlockDate(
  blockId: BlockIdentifier | undefined,
  chainId: number,
): Promise<Date | undefined> {
  const drift = getDrift({ chainId });

  const block = await drift.getBlock(blockId);

  if (block) {
    return new Date(Number(block.timestamp) * 1000);
  }

  if (typeof blockId !== "bigint") {
    return undefined;
  }

  // Estimate based on the latest block and the average block time
  const latestBlock = await drift.getBlockNumber();
  const msLeft = (blockId - latestBlock) * blockTime * 1000n;
  return new Date(Date.now() + Number(msLeft));
}
