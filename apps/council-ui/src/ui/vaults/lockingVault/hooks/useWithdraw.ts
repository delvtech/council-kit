import { LockingVault } from "@council/sdk";
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

interface WithdrawArguments {
  signer: Signer;
  amount: string;
}

export function useWithdraw(
  vaultAddress: string,
): UseMutationResult<string, unknown, WithdrawArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let transactionHash: string;
  return useMutation(
    async ({ signer, amount }: WithdrawArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      return vault.withdraw(signer, amount, {
        onSubmitted: (hash) => {
          makeTransactionSubmittedToast("Withdrawing", hash);
          transactionHash = hash;
        },
      });
    },
    {
      onSuccess: (hash, { amount }) => {
        makeTransactionSuccessToast(`Successfully withdrew ${amount}!`, hash);
        queryClient.invalidateQueries();
      },
      onError(error, { amount }) {
        makeTransactionErrorToast(
          `Failed to withdraw ${amount}`,
          transactionHash,
        );
        console.error(error);
      },
    },
  );
}
