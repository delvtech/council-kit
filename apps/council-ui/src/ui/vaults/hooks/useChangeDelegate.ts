import { VestingVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import index from "react-hot-toast";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { useCouncil } from "src/ui/council/useCouncil";

interface ChangeDelegateArguments {
  signer: Signer;
  delegate: string;
}

export function useChangeDelegate(
  vaultAddress: string,
): UseMutationResult<string, unknown, ChangeDelegateArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
  return useMutation(
    ({ signer, delegate }: ChangeDelegateArguments): Promise<string> => {
      const vault = new VestingVault(vaultAddress, context);
      return vault.changeDelegate(signer, delegate, {
        onSubmitted: () => (toastId = index.loading("Delegating")),
      });
    },
    {
      onSuccess: (_, { delegate }) => {
        index.success(`Successfully delegated to ${formatAddress(delegate)}!`, {
          id: toastId,
        });
        // Invalidates the UI cache so that components will refetch the latest data.
        // Note, the SDK has its own data cache that is cleared when we call changeDelegate.
        queryClient.invalidateQueries();
      },
      onError(error, { delegate }) {
        index.error(`Failed to delegate to ${formatAddress(delegate)}!`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}
