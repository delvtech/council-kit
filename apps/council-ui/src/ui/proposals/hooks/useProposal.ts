import { Address } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";

interface UseProposalCreationOptions {
  votingContract: Address;
  proposalId: bigint;
  chainId?: SupportedChainId;
}

/**
 * Get a proposal by its id.
 */
export default function useProposal({
  votingContract,
  proposalId,
  chainId,
}: UseProposalCreationOptions) {
  chainId = useSupportedChainId(chainId);
  const council = useReadCouncil({ chainId });
  const enabled = !!chainId && !!council;
  return useQuery({
    queryKey: ["proposal", chainId, votingContract, proposalId],
    enabled,
    queryFn: enabled
      ? () => council.coreVoting(votingContract).getProposal(proposalId)
      : undefined,
  });
}
