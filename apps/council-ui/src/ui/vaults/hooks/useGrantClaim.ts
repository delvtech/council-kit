import { VestingVault } from "@council/sdk";
import { UseMutationResult } from "@tanstack/react-query";
import { Signer } from "ethers";
import index from "react-hot-toast";
import { useCouncil } from "src/ui/council/useCouncil";
import { useMutation, useQueryClient } from "wagmi";

interface ClaimGrantArguments {
  signer: Signer;
}

export function useClaimGrant(
  vestingVaultAddress: string,
): UseMutationResult<string, unknown, ClaimGrantArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;

  return useMutation(
    ({ signer }: ClaimGrantArguments) => {
      const vault = new VestingVault(vestingVaultAddress, context);

      return vault.claim(signer, {
        onSubmitted: () => (toastId = index.loading("Claiming grant...")),
      });
    },
    {
      onSuccess: () => {
        index.success(`Successfully claimed your ELFI!`, {
          id: toastId,
        });
        // Invalidates the UI cache so that components will refetch the latest data.
        // Note, the SDK has its own data cache that is cleared when we call claim.

        queryClient.invalidateQueries();
      },
      onError(error) {
        index.error(`Failed to claim grant!`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}
