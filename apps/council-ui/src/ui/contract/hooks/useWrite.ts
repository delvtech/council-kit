import {
  MutationStatus,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { makeTransactionErrorToast } from "src/ui/base/toast/makeTransactionErrorToast";
import { makeTransactionSubmittedToast } from "src/ui/base/toast/makeTransactionSubmittedToast";
import { makeTransactionSuccessToast } from "src/ui/base/toast/makeTransactionSuccessToast";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { usePublicClient } from "wagmi";

/**
 * A hook which takes a write function that returns a transaction hash and wraps
 * it with unified logic for:
 *
 * - Waiting for the transaction to be mined
 * - Showing toast notifications for transaction status
 * - Invalidating queries on success
 */
export function useWrite<
  TFunction extends (...args: any[]) => Promise<`0x${string}`>,
>({
  writeFn,
}: {
  writeFn: TFunction;
}): {
  write: TFunction;
  status: MutationStatus;
  transactionHash: `0x${string}` | undefined;
} {
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();

  const chainId = useSupportedChainId();
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();

  const mutationFn = async (...args: Parameters<TFunction>) => {
    const hash = await writeFn(...args);
    setTransactionHash(hash);
    makeTransactionSubmittedToast("Approving", hash, chainId);
    await publicClient?.waitForTransactionReceipt({ hash });
    return hash;
  };

  const { mutate, status } = useMutation({
    mutationFn: mutationFn as TFunction,
    onSuccess: (hash) => {
      makeTransactionSuccessToast("Successfully approved!", hash, chainId);
      // All query cache can be invalidated. The SDK uses it's own cache which
      // has built-in invalidation logic based on the methods called.
      queryClient.invalidateQueries();
    },
    onError(error) {
      makeTransactionErrorToast("Failed to approve", transactionHash, chainId);
      console.error(error);
    },
  });

  return {
    write: mutate as TFunction,
    status,
    transactionHash,
  };
}
