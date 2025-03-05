import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { ProposalConfig } from "src/config/types";
import { getVotingContractConfig } from "src/config/utils/getVotingContractConfig";

export function getProposalConfig({
  chainId,
  votingContract,
  id,
}: {
  chainId: SupportedChainId;
  votingContract: Address;
  id: bigint;
}): ExtendedProposalConfig | undefined {
  const votingContractConfig = getVotingContractConfig({
    chainId,
    address: votingContract,
  });

  if (!votingContractConfig) {
    return;
  }

  const foundProposal = votingContractConfig.proposals[id.toString()];
  if (foundProposal) {
    return {
      ...foundProposal,
      votingContract,
      chainId,
    };
  }
}

export type ExtendedProposalConfig = ProposalConfig & {
  votingContract: Address;
  chainId: SupportedChainId;
};
