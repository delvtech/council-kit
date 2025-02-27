import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { getCoreVotingConfig } from "src/config/utils/getCoreVotingConfig";

export function getProposalConfig({
  id,
  coreVotingAddress,
  chainId,
}: {
  id: bigint;
  coreVotingAddress: Address;
  chainId: SupportedChainId;
}) {
  const coreVotingConfig = getCoreVotingConfig({
    address: coreVotingAddress,
    chainId,
  });
  if (!coreVotingConfig) {
    return undefined;
  }
  return coreVotingConfig.proposals[String(id)];
}
