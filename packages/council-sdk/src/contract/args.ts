import { BlockTag, ContractReadOptions } from "@council/evm-client";

export type BlockLike = BlockTag | bigint;

export function blockToReadOptions(
  block?: BlockLike,
): ContractReadOptions | undefined {
  return typeof block === "bigint"
    ? {
        blockNumber: block,
      }
    : typeof block === "string"
      ? {
          blockTag: block,
        }
      : undefined;
}
