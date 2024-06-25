import { MutationStatus } from "@tanstack/react-query";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";

export interface ChangeDelegateOptions {
  vaultAddress: `0x${string}`;
  newDelegate: `0x${string}`;
}

export function useChangeDelegate(): {
  changeDelegate: ((options: ChangeDelegateOptions) => void) | undefined;
  status: MutationStatus;
  transactionHash: `0x${string}` | undefined;
} {
  const council = useReadWriteCouncil();
  const enabled = !!council;

  const { write, status, transactionHash } = useWrite({
    pendingMessage: "Changing delegate...",
    successMessage: "Delegate changed!",
    errorMessage: "Failed to change delegate.",
    writeFn: ({
      newDelegate,
      vaultAddress,
    }: ChangeDelegateOptions): Promise<`0x${string}`> => {
      if (!enabled) {
        throw new Error(
          "Connection to council not available. Check your wallet connection.",
        );
      }

      return council
        .lockingVault(vaultAddress)
        .changeDelegate({ delegate: newDelegate });
    },
  });

  return {
    changeDelegate: enabled ? write : undefined,
    status,
    transactionHash,
  };
}
