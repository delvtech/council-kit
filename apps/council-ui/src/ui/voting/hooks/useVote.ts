import { Ballot } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { makeTransactionSubmittedToast } from "src/ui/base/toast/makeTransactionSubmittedToast";
import { makeTransactionSuccessToast } from "src/ui/base/toast/makeTransactionSuccessToast";
import { useCouncil } from "src/ui/council/useCouncil";

interface VoteArguments {
  signer: Signer;
  proposalId: number;
  ballot: Ballot;
}

export function useVote(): UseMutationResult<
  string,
  unknown,
  VoteArguments,
  unknown
> {
  const { coreVoting } = useCouncil();
  const queryClient = useQueryClient();
  let transactionHash: string;
  return useMutation(
    async ({ signer, proposalId, ballot }: VoteArguments) => {
      const proposal = coreVoting.getProposal(proposalId);
      return proposal.vote(signer, ballot, {
        onSubmitted: (hash) => {
          makeTransactionSubmittedToast("Voting", hash);
          transactionHash = hash;
        },
      });
    },
    {
      onSuccess: (hash, { proposalId, ballot }) => {
        makeTransactionSuccessToast(
          `Successfully voted ${ballot} on Proposal ${proposalId}!`,
          hash,
        );
        queryClient.invalidateQueries();
      },
      onError: (error, { proposalId, ballot }) => {
        makeTransactionErrorToast(
          `Failed to vote ${ballot} on Proposal ${proposalId}.`,
          transactionHash,
        );
        console.error(error);
      },
    },
  );
}
