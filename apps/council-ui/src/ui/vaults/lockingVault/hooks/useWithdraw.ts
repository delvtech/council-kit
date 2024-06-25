import { MutationStatus } from "@tanstack/react-query";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";

export interface WithdrawOptions {
  vaultAddress: `0x${string}`;
  amount: bigint;
}

export function useWithdraw(): {
  withdraw: ((options: WithdrawOptions) => void) | undefined;
  status: MutationStatus;
  transactionHash: `0x${string}` | undefined;
} {
  const council = useReadWriteCouncil();
  const enabled = !!council;

  const { write, status, transactionHash } = useWrite({
    pendingMessage: "Withdrawing...",
    successMessage: "Withdrawn!",
    errorMessage: "Failed to withdraw.",
    writeFn: ({
      vaultAddress,
      amount,
    }: WithdrawOptions): Promise<`0x${string}`> => {
      if (!enabled) {
        throw new Error(
          "Connection to council not available. Check your wallet connection.",
        );
      }

      return council.lockingVault(vaultAddress).withdraw({
        amount,
      });
    },
  });

  return {
    withdraw: enabled ? write : undefined,
    status,
    transactionHash,
  };
}
