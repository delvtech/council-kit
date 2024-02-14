import { ReadVote, ReadVoter } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { useAccount } from "wagmi";

interface UseVoteOptions {
  coreVotingAddress: `0x${string}`;
  proposalId: bigint;
  account?: ReadVoter | `0x${string}`;
}

export function useVote({
  coreVotingAddress,
  proposalId,
  account,
}: UseVoteOptions): {
  vote: ReadVote | undefined;
  status: QueryStatus;
} {
  const council = useReadCouncil();
  const { address: connectedAccount } = useAccount();

  let accountToUse = account || connectedAccount;
  if (typeof accountToUse === "string") {
    accountToUse = council.voter(accountToUse);
  }

  const enabled = !!accountToUse;

  const { data, status } = useQuery({
    queryKey: ["vote", String(proposalId), accountToUse],
    enabled,
    queryFn: enabled
      ? async () => {
          const account = accountToUse!;
          return council
            .coreVoting({ address: coreVotingAddress })
            .getVote({ account, proposalId });
        }
      : undefined,
  });

  return {
    vote: data,
    status: status,
  };
}
