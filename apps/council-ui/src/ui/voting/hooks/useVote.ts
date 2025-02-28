import { Address } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/sdk/hooks/useReadCouncil";

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
  const council = useReadCouncil();
  const enabled = !!account && !!chainId && !!council;
  return useQuery({
    queryKey: ["vote", chainId, votingContract, account, chainId],
    enabled,
    queryFn: enabled
      ? () => {
          return council
            .coreVoting(votingContract)
            .getVote({ proposalId, voter: account });
        }
      : undefined,
  });
}
