import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";

export function getVotingContractConfig(
  address: Address,
  chainId: SupportedChainId,
) {
  const { coreVoting, gscVoting } = getCouncilConfig(chainId);
  if (coreVoting.address === address) {
    return { ...coreVoting, isGsc: false };
  }
  if (gscVoting?.vault.address === address) {
    return { ...gscVoting, isGsc: true };
  }
}
