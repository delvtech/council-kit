import { Address } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { useReadCouncil } from "src/ui/council/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";

interface UseVoteOptions {
  votingContract: Address;
  proposalId: bigint;
  account: Address | undefined;
  chainId?: SupportedChainId;
}

export function useVote({
  votingContract,
  proposalId,
  account,
  chainId,
}: UseVoteOptions) {
  chainId = useSupportedChainId(chainId);
  const council = useReadCouncil({ chainId });
  const enabled = !!account && !!chainId && !!council;
  return useQuery({
    queryKey: ["vote", chainId, votingContract, account, chainId],
    enabled,
    queryFn: enabled
      ? async () => {
          const vote = await council
            .coreVoting(votingContract)
            .getVote({ proposalId, voter: account });
          return vote || null;
        }
      : undefined,
  });
}
