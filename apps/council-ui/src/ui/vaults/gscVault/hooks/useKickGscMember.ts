import { Address } from "@delvtech/drift";
import { useWrite } from "src/ui/contract/useWrite";
import { useReadWriteGscVault } from "./useReadWriteGscVault";

export function useKickGscMember() {
  const gscVault = useReadWriteGscVault();
  const enabled = !!gscVault;
  return useWrite({
    pendingMessage: "Kicking GSC member...",
    successMessage: "GSC member kicked!",
    errorMessage: "Failed to kick GSC member.",
    writeFn: enabled
      ? async (member: Address) => {
          return gscVault.kick({ args: { member } });
        }
      : undefined,
  });
}
