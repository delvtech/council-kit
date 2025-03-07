import { Address } from "@delvtech/drift";
import { useWrite } from "src/ui/contract/useWrite";
import { useReadWriteCouncil } from "src/ui/council/useReadWriteCouncil";

export interface DepositOptions {
  vaultAddress: Address;
  amount: bigint;
  account?: Address;
}

export function useDeposit() {
  const council = useReadWriteCouncil();
  const enabled = !!council;
  return useWrite({
    pendingMessage: "Depositing...",
    successMessage: "Deposited!",
    errorMessage: "Failed to deposit.",
    writeFn: enabled
      ? ({
          vaultAddress,
          amount,
          account,
        }: DepositOptions): Promise<`0x${string}`> => {
          return council.lockingVault(vaultAddress).deposit({
            args: {
              account,
              amount,
            },
          });
        }
      : undefined,
  });
}
