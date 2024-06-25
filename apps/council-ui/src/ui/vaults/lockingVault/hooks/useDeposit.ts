import { MutationStatus } from "@tanstack/react-query";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";

export interface DepositOptions {
  vaultAddress: `0x${string}`;
  amount: bigint;
  account?: `0x${string}`;
}

export function useDeposit(): {
  deposit: ((options: DepositOptions) => void) | undefined;
  status: MutationStatus;
  transactionHash: `0x${string}` | undefined;
} {
  const council = useReadWriteCouncil();
  const enabled = !!council;

  const { write, status, transactionHash } = useWrite({
    pendingMessage: "Depositing...",
    successMessage: "Deposited!",
    errorMessage: "Failed to deposit.",
    writeFn: ({
      vaultAddress,
      amount,
      account,
    }: DepositOptions): Promise<`0x${string}`> => {
      if (!enabled) {
        throw new Error(
          "Connection to council not available. Check your wallet connection.",
        );
      }

      return council.lockingVault(vaultAddress).deposit({
        account,
        amount,
      });
    },
  });

  return {
    deposit: enabled ? write : undefined,
    status,
    transactionHash,
  };
}
