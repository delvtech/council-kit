import { BlockLike } from "src/utils/blockToReadOptions";

export class BlockNotFoundError extends Error {
  constructor(block?: BlockLike) {
    super(`Block${block !== undefined ? ` ${block}` : ""} not found`);
    this.name = "BlockNotFound";
  }
}
