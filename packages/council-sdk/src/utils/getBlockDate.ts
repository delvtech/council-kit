import { providers } from "ethers";

// based on https://etherscan.io/chart/blocktime
const DEFAULT_BLOCK_TIME = 12.07;

export interface GetBlockDateOptions<TEstimate extends boolean = false> {
  /**
   * If true, dates for blocks that haven't been mined yet will be estimated
   * based on the `blockTime` option. If false, blocks that haven't been mined
   * yet will return `null`.
   */
  estimateFutureDates?: TEstimate;
  /**
   * The number of seconds it takes to mine a block; used when estimating the
   * date of a block that hasn't been mined yet. Defaults to 12.05
   */
  blockTime?: number;
}

// Remove null type if TEstimate is true
type PossibleDate<TEstimate> = TEstimate extends true ? Date : Date | null;

/**
 * Get the date of a given block by it's block number
 */
export async function getBlockDate<TEstimate extends boolean = false>(
  blockNumber: number,
  provider: providers.Provider,
  options?: GetBlockDateOptions<TEstimate>,
): Promise<PossibleDate<TEstimate>> {
  const { estimateFutureDates = false, blockTime = DEFAULT_BLOCK_TIME } =
    options || {};
  const block = await provider.getBlock(blockNumber);
  if (block) {
    new Date(block.timestamp * 1000);
  } else if (estimateFutureDates) {
    const latestBlock = await provider.getBlockNumber();
    const secondsLeft = (blockNumber - latestBlock) * blockTime;
    return new Date(Date.now() + secondsLeft * 1000);
  }
  return null as PossibleDate<TEstimate>;
}
