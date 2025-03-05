import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadWriteCouncil } from "src/ui/council/useReadWriteCouncil";
import { maxUint256 } from "viem";

export function useApprove() {
  const council = useReadWriteCouncil();
  const enabled = !!council;
  return useWrite({
    pendingMessage: "Approving...",
    successMessage: "Approved!",
    errorMessage: "Failed to approve.",
    writeFn: enabled
      ? async (vaultAddress: `0x${string}`) => {
          const token = await council.lockingVault(vaultAddress).getToken();
          return token.approve({
            args: {
              amount: maxUint256,
              spender: vaultAddress,
            },
          });
        }
      : undefined,
  });
}
