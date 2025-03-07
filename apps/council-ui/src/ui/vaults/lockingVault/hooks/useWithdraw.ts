import { useWrite } from "src/ui/contract/useWrite";
import { useReadWriteCouncil } from "src/ui/council/useReadWriteCouncil";

export interface WithdrawOptions {
  vaultAddress: `0x${string}`;
  amount: bigint;
}

export function useWithdraw() {
  const council = useReadWriteCouncil();
  const enabled = !!council;
  return useWrite({
    pendingMessage: "Withdrawing...",
    successMessage: "Withdrawn!",
    errorMessage: "Failed to withdraw.",
    writeFn: enabled
      ? ({ vaultAddress, amount }: WithdrawOptions): Promise<`0x${string}`> => {
          if (!enabled) {
            throw new Error(
              "Connection to council not available. Check your wallet connection.",
            );
          }

          return council.lockingVault(vaultAddress).withdraw({
            args: { amount },
          });
        }
      : undefined,
  });
}
