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
        // The SDK will manage cache invalidation for us ✨
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
