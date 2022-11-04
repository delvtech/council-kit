import { providers } from "ethers";

export async function getBlockDate(
  blockNumber: number,
  provider: providers.Provider,
): Promise<Date | null> {
  const block = await provider.getBlock(blockNumber);
  return block ? new Date(block.timestamp * 1000) : null;
}
