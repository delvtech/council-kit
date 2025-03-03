import { Address } from "@delvtech/drift";
import { useWrite } from "src/ui/contract/hooks/useWrite";
import { useReadWriteCouncil } from "src/ui/sdk/useReadWriteCouncil";

export interface ChangeDelegateOptions {
  vaultAddress: Address;
  newDelegate: Address;
}

export function useChangeDelegate() {
  const council = useReadWriteCouncil();
  const enabled = !!council;
  return useWrite({
    pendingMessage: "Changing delegate...",
    successMessage: "Delegate changed!",
    errorMessage: "Failed to change delegate.",
    writeFn: enabled
      ? ({
          newDelegate,
          vaultAddress,
        }: ChangeDelegateOptions): Promise<Address> => {
          return council
            .lockingVault(vaultAddress)
            .changeDelegate({ args: { newDelegate } });
        }
      : undefined,
  });
}
