import { UsePublicClientReturnType } from "wagmi";

const blockTime = 12n;

/**
 * Get the date of a mined block or estimate the date of a future block.
 */
export async function getBlockDate(
  blockNumber: bigint,
  client: UsePublicClientReturnType,
): Promise<Date | undefined> {
  if (!client) {
    return;
  }

  const block = await client.getBlock({
    blockNumber: blockNumber,
  });
  if (block) {
    return new Date(Number(block.timestamp) * 1000);
  }

  const latestBlock = await client.getBlockNumber();
  const secondsLeft = (blockNumber - latestBlock) * blockTime;
  return new Date(Date.now() + Number(secondsLeft) * 1000);
}
