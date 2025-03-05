import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadWriteCouncil } from "src/ui/council/useReadWriteCouncil";

export interface ChangeDelegateOptions {
  vaultAddress: `0x${string}`;
  newDelegate: `0x${string}`;
}

export function useChangeDelegate() {
  const council = useReadWriteCouncil();
  const enabled = !!council;
  return useWrite({
    pendingMessage: "Changing delegate...",
    successMessage: "Delegate changed!",
    errorMessage: "Failed to change delegate.",
    writeFn: enabled
      ? ({ newDelegate, vaultAddress }: ChangeDelegateOptions) => {
          return council
            .vestingVault(vaultAddress)
            .changeDelegate({ args: { newDelegate } });
        }
      : undefined,
  });
}
