import { ReadWriteAdapter, ReplaceProps } from "@delvtech/drift";
import { Entity, EntityWriteParams } from "src/entities/Entity";
import { ReadToken } from "src/entities/token/ReadToken";

export interface ReadWriteToken<A extends ReadWriteAdapter = ReadWriteAdapter>
  extends ReplaceProps<ReadToken<A>, Entity<A>> {
  /**
   * Give a spending allowance to a given spender.
   * @returns The transaction hash.
   */
  approve(params: ApproveParams): Promise<`0x${string}`>;
}

/**
 * Params for approving a spending allowance on a {@linkcode ReadWriteToken}.
 */
export type ApproveParams = EntityWriteParams<{
  /**
   * The address of the spender.
   */
  spender: `0x${string}`;
  /**
   * The amount of tokens the spender can spend.
   */
  amount: bigint;
}>;
