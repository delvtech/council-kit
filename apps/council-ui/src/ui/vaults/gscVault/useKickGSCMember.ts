import { GSCVault } from "@council/sdk";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Signer } from "ethers";
import toast from "react-hot-toast";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { useCouncil } from "src/ui/council/useCouncil";

interface KickGSCMemberOptions {
  signer: Signer;
  memberAddress: string;
}
export function useKickGSCMember(
  gscVaultAddress: string,
): UseMutationResult<string, unknown, KickGSCMemberOptions> {
  const { context } = useCouncil();
  const queryClient = useQueryClient();
  let toastId: string;

  return useMutation({
    mutationFn: ({
      signer,
      memberAddress,
    }: KickGSCMemberOptions): Promise<string> => {
      const gscVault = new GSCVault(gscVaultAddress, context);
      return gscVault.kick(signer, memberAddress, {
        onSubmitted: () =>
          (toastId = toast.loading(
            `Kicking GSC Member: ${formatAddress(memberAddress)}`,
          )),
      });
    },
    onSuccess: (_, { memberAddress }) => {
      toast.success(
        `Successfully kicked ${formatAddress(memberAddress)} from the GSC!`,
        {
          id: toastId,
        },
      );
      queryClient.invalidateQueries();
    },
    onError(error, { memberAddress }) {
      toast.error(
        `Failed to kick ${formatAddress(memberAddress)} from the GSC.`,
        {
          id: toastId,
        },
      );
      console.error(error);
    },
  });
}
