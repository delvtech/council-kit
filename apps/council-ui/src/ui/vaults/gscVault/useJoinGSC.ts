import { GSCVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import toast from "react-hot-toast";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { getCoreVotingVaults } from "src/vaults/vaults";

interface JoinGSCOptions {
  signer: Signer;
}
export function useJoinGSC(
  gscVaultAddress: string,
): UseMutationResult<string, unknown, JoinGSCOptions> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  const chainId = useChainId();
  const coreVotingVaultAddresses = getCoreVotingVaults(chainId).map(
    ({ address }) => address,
  );
  let toastId: string;

  return useMutation({
    mutationFn: ({ signer }: JoinGSCOptions): Promise<string> => {
      const gscVault = new GSCVault(gscVaultAddress, context);
      return gscVault.join(signer, coreVotingVaultAddresses, {
        onSubmitted: () =>
          (toastId = toast.loading(`Transaction submitted to join the GSC...`)),
      });
    },
    onSuccess: () => {
      toast.success(`Successfully joined the GSC!`, {
        id: toastId,
      });
      queryClient.invalidateQueries();
    },
    onError(error) {
      toast.error(
        `Failed to join the GSC. Please make sure you have the requisite voting power to become a member first.`,
        {
          id: toastId,
        },
      );
      console.error(error);
    },
  });
}
