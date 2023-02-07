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
import { useChainId } from "src/ui/network/useChainId";

interface VoteArguments {
  signer: Signer;
  proposalId: number;
  ballot: Ballot;
}

export function useGSCVote(): UseMutationResult<
  string,
  unknown,
  VoteArguments,
  unknown
> {
  const { gscVoting } = useCouncil();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  let transactionHash: string;
  return useMutation(
    async ({ signer, proposalId, ballot }: VoteArguments) => {
      if (!gscVoting) {
        throw new Error(
          `Attempted to vote on GSC proposal ${proposalId}, but no config was found for GSC. See src/config.`,
        );
      }
      const proposal = gscVoting.getProposal(proposalId);
      return proposal.vote(signer, ballot, {
        onSubmitted: (hash) => {
          makeTransactionSubmittedToast("Voting", hash, chainId);
          transactionHash = hash;
        },
      });
    },
    {
      onSuccess: (hash, { proposalId, ballot }) => {
        makeTransactionSuccessToast(
          `Successfully voted ${ballot} on GSC Proposal ${proposalId}!`,
          hash,
          chainId,
        );
        queryClient.invalidateQueries();
      },

      onError: (error, { proposalId, ballot }) => {
        makeTransactionErrorToast(
          `Failed to vote ${ballot} on GSC Proposal ${proposalId}}.`,
          transactionHash,
          chainId,
        );
        console.error(error);
      },
    },
  );
}
