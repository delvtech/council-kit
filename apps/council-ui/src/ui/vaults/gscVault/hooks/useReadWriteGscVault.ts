import { ReadWriteGscVault } from "@delvtech/council-js";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadWriteCouncil } from "src/ui/sdk/useReadWriteCouncil";

/**
 * Use a ReadWriteGscVault instance for configured GSC vault.
 */
export function useReadWriteGscVault(): ReadWriteGscVault | undefined {
  const { gscVoting } = useCouncilConfig();
  const council = useReadWriteCouncil();

  return useMemo(
    () => gscVoting && council?.gscVault(gscVoting.vaults[0].address),
    [council, gscVoting],
  );
}
