import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";

export function getCoreVotingConfig({
  address,
  chainId,
}: {
  address: Address;
  chainId: SupportedChainId;
}) {
  const { coreVoting, gscVoting } = getCouncilConfig(chainId);
  if (coreVoting.address === address) {
    return { ...coreVoting, isGsc: false };
  }
  if (gscVoting?.vault.address === address) {
    return { ...gscVoting, isGsc: true };
  }
}
