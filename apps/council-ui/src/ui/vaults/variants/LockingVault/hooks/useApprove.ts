import { LockingVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { ethers, Signer } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import toast from "react-hot-toast";
import { useCouncil } from "src/ui/council/useCouncil";

interface ApproveArguments {
  signer: Signer;
}

export function useApprove(
  vaultAddress: string,
): UseMutationResult<string, unknown, ApproveArguments> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;
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
          onSubmitted: () => (toastId = toast.loading("Approving")),
        },
      );
    },
    {
      onSuccess: () => {
        toast.success(`Successfully approved!`, {
          id: toastId,
        });
        queryClient.invalidateQueries();
      },
      onError(error) {
        toast.error(`Failed to approve`, {
          id: toastId,
        });
        console.error(error);
      },
    },
  );
}
