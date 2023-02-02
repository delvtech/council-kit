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

interface DepositArguments {
  signer: Signer;
  amount: string;
}

export function useDeposit(
  vaultAddress: string,
): UseMutationResult<string, unknown, DepositArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let transactionHash: string;
  return useMutation(
    async ({ signer, amount }: DepositArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      const account = await signer.getAddress();
      return vault.deposit(signer, account, amount, account, {
        onSubmitted: (hash) => {
          makeTransactionSubmittedToast("Depositing", hash);
          transactionHash = hash;
        },
      });
    },
    {
      onSuccess: (hash, { amount }) => {
        makeTransactionSuccessToast(`Successfully deposited ${amount}!`, hash);
        queryClient.invalidateQueries();
      },
      onError(error, { amount }) {
        makeTransactionErrorToast(
          `Failed to deposit ${amount}`,
          transactionHash,
        );
        console.error(error);
      },
    },
  );
}
