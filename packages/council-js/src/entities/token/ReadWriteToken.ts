import { ReadWriteAdapter, ReplaceProps } from "@delvtech/drift";
import { SdkClient, SdkWriteParams } from "src/drift/SdkClient";
import { ReadToken } from "src/token/ReadToken";

export interface ReadWriteToken<A extends ReadWriteAdapter = ReadWriteAdapter>
  extends ReplaceProps<ReadToken<A>, SdkClient<A>> {
  /**
   * Give a spending allowance to a given spender.
   * @returns The transaction hash.
   */
  approve(params: ApproveParams): Promise<`0x${string}`>;
}

/**
 * Params for approving a spending allowance on a {@linkcode ReadWriteToken}.
 */
export type ApproveParams = SdkWriteParams<{
  /**
   * The address of the owner of the tokens. If not provided, the current
   * account is used.
   */
  owner?: `0x${string}`;
  /**
   * The address of the spender.
   */
  spender: `0x${string}`;
  /**
   * The amount of tokens the spender can spend.
   */
  amount: bigint;
}>;
