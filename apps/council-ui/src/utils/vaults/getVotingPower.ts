import type { ReadVotingVault } from "@delvtech/council-js";
import { Address, RangeBlock } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { getCouncil } from "src/utils/council/getCouncil";

/**
 * A wrapper around the {@linkcode ReadVotingVault.getVotingPower} method which
 * returns `0n` if the call fails. This is needed because Wagmi doesn't decode
 * the `uninitialized` error which is thrown when the voter has no data in the
 * vault, so the SDK doesn't handle it.
 */
export function getVotingPower({
  voter,
  vault,
  chainId,
  block,
}: {
  voter: Address;
  vault: Address;
  chainId: SupportedChainId;
  block?: RangeBlock;
}): Promise<bigint> {
  const council = getCouncil(chainId);
  return council
    .votingVault(vault)
    .getVotingPower({ voter, block })
    .catch(() => 0n);
}
