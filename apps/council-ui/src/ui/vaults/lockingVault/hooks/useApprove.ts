import { LockingVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { ethers, Signer } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { makeTransactionSuccessToast } from "src/ui/base/toast/makeTransactionSuccessToast";
import { useCouncil } from "src/ui/council/useCouncil";

interface ApproveArguments {
  signer: Signer;
}

export function useApprove(
  vaultAddress: string,
): UseMutationResult<string, unknown, ApproveArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let transactionHash: string;
  return useMutation(
    async ({ signer }: ApproveArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      const token = await vault.getToken();
      const decimals = await token.getDecimals();
      return token.approve(
        signer,
        vault.address,
        formatUnits(ethers.constants.MaxUint256, decimals),
        {
          onSubmitted: (hash) => {
            makeTransactionSuccessToast("Approving", hash);
            transactionHash = hash;
          },
        },
      );
    },
    {
      onSuccess: (hash) => {
        makeTransactionSuccessToast("Successfully approved!", hash);
        queryClient.invalidateQueries();
      },
      onError(error) {
        makeTransactionErrorToast("Failed to approve", transactionHash);
        console.error(error);
      },
    },
  );
}
