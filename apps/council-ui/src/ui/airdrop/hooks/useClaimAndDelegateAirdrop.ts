import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Signer } from "ethers";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { makeTransactionSubmittedToast } from "src/ui/base/toast/makeTransactionSubmittedToast";
import { makeTransactionSuccessToast } from "src/ui/base/toast/makeTransactionSuccessToast";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { useMutation } from "wagmi";
import { useAirdropData } from "./useAirdropData";
import { useClaimableAirdropAmount } from "./useClaimableAirdropAmount";

interface ClaimAndDelegateArguments {
  signer: Signer;
  delegate: string;
  recipient: string;
}

export function useClaimAndDelegateAirdrop(): UseMutationResult<
  string,
  unknown,
  ClaimAndDelegateArguments
> {
  const { airdrop } = useCouncil();
  const { data: claimableAmount } = useClaimableAirdropAmount();
  const { data } = useAirdropData();
  const chainId = useChainId();
  const queryClient = useQueryClient();

  let transactionHash: string;
  return useMutation<string, unknown, ClaimAndDelegateArguments>({
    mutationFn: ({
      signer,
      delegate,
      recipient,
    }: ClaimAndDelegateArguments) => {
      if (!airdrop) {
        throw new Error("No airdrop configured");
      }
      if (!claimableAmount) {
        throw new Error("No claimable amount");
      }
      if (!data) {
        throw new Error("No airdrop data found");
      }

      return airdrop.claimAndDelegate(
        signer,
        claimableAmount,
        delegate,
        data?.amount,
        data?.proof,
        recipient,
        {
          onSubmitted: (hash) => {
            makeTransactionSubmittedToast("Claiming airdrop", hash, chainId);
            transactionHash = hash;
          },
        },
      );
    },
    onSuccess: (hash) => {
      makeTransactionSuccessToast(
        `Successfully claimed airdrop!`,
        hash,
        chainId,
      );
      queryClient.invalidateQueries();
    },
    onError(error) {
      makeTransactionErrorToast(
        `Failed to claim airdrop`,
        transactionHash,
        chainId,
      );
      console.error(error);
    },
  });
}
