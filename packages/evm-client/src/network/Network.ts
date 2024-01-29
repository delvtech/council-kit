import { BlockTag } from "src/network/BlockTag";
import { Transaction } from "src/network/Transaction";
export type GetBlockOptions =
  | {
      blockHash?: `0x${string}`;
      blockNumber?: never;
      blockTag?: never;
    }
  | {
      blockHash?: never;
      blockNumber?: bigint;
      blockTag?: never;
    }
  | {
      blockHash?: never;
      blockNumber?: never;
      /**
       * @default 'latest'
       */
      blockTag?: BlockTag;
    };

/**
 * An interface representing data the SDK needs to get from the network.
 */
export interface Network {
  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  getBlock(
    args?: GetBlockOptions,
  ): Promise<{ blockNumber: bigint; timestamp: bigint }>;

  getTransaction({
    hash,
  }: {
    hash: `0x${string}`;
  }): Promise<Transaction>;
}
