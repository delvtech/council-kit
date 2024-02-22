import { BlockTag, ContractReadOptions } from "@delvtech/evm-client";

export type BlockLike = BlockTag | bigint;

export function blockToReadOptions(
  block?: BlockLike,
): ContractReadOptions | undefined {
  switch (typeof block) {
    case "bigint":
      return {
        blockNumber: block,
      };

    case "string":
      return {
        blockTag: block,
      };

    default:
      return undefined;
  }
}
