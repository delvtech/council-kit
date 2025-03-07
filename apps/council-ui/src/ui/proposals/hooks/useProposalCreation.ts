import { Address } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import { useReadCouncil } from "src/ui/council/useReadCouncil";

interface UseProposalCreationOptions {
  votingContract: Address;
  proposalId: bigint;
  chainId?: SupportedChainId;
}

/**
 * Get the proposal creation event for a given proposal id.
 */
export default function useProposalCreation({
  votingContract,
  proposalId,
  chainId,
}: UseProposalCreationOptions) {
  chainId = useSupportedChainId(chainId);
  const council = useReadCouncil({ chainId });
  const enabled = !!chainId && !!council;
  return useQuery({
    queryKey: ["proposalCreation", chainId, votingContract, proposalId],
    enabled,
    queryFn: enabled
      ? async () => {
          const createEvents = await council
            .coreVoting(votingContract)
            .getProposalCreations();
          return createEvents.find((event) => event.proposalId === proposalId);
        }
      : undefined,
  });
}
