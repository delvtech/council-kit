import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { ProposalConfig } from "src/config/types";
import { getVotingContractConfig } from "src/config/utils/getVotingContractConfig";

export function getProposalConfig({
  votingContract,
  id,
  chainId,
}: {
  votingContract: Address;
  id: bigint;
  chainId: SupportedChainId;
}): ExtendedProposalConfig | undefined {
  const votingContractConfig = getVotingContractConfig({
    address: votingContract,
    chainId,
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
