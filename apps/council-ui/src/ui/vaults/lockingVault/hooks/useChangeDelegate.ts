interface ChangeDelegateArguments {
  signer: Signer;
  delegate: string;
}
import { LockingVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { makeTransactionSubmittedToast } from "src/ui/base/toast/makeTransactionSubmittedToast";
import { makeTransactionSuccessToast } from "src/ui/base/toast/makeTransactionSuccessToast";
import { useCouncil } from "src/ui/council/useCouncil";

export function useChangeDelegate(
  vaultAddress: string,
): UseMutationResult<string, unknown, ChangeDelegateArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let transactionHash: string;
  return useMutation(
    ({ signer, delegate }: ChangeDelegateArguments): Promise<string> => {
      const vault = new LockingVault(vaultAddress, context);
      return vault.changeDelegate(signer, delegate, {
        onSubmitted: (hash) => {
          makeTransactionSubmittedToast("Delegating", hash);
          transactionHash = hash;
        },
      });
    },
    {
      onSuccess: (hash, { delegate }) => {
        makeTransactionSuccessToast(
          `Successfully delegated to ${formatAddress(delegate)}!`,
          hash,
        );
        queryClient.invalidateQueries();
      },
      onError(error, { delegate }) {
        makeTransactionErrorToast(
          `Failed to delegate to ${formatAddress(delegate)}`,
          transactionHash,
        );
        console.error(error);
      },
    },
  );
}
