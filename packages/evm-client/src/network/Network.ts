import { BlockTag } from "src/network/BlockTag";
export type GetBlockParameters =
  | {
      /** Hash of the block. */
      blockHash?: `0x${string}`;
      blockNumber?: never;
      blockTag?: never;
    }
  | {
      blockHash?: never;
      /** The block number. */
      blockNumber?: bigint;
      blockTag?: never;
    }
  | {
      blockHash?: never;
      blockNumber?: never;
      /**
       * The block tag.
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
    args?: GetBlockParameters,
  ): Promise<{ blockNumber: bigint; timestamp: bigint }>;
}
