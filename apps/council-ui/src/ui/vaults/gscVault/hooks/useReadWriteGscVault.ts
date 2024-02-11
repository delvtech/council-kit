import { ReadWriteGscVault } from "@delvtech/council-viem";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";

/**
 * Use a ReadWriteGscVault instance for configured GSC vault.
 */
export function useReadWriteGscVault(): ReadWriteGscVault | undefined {
  const { gscVoting } = useCouncilConfig();
  const council = useReadWriteCouncil();

  return useMemo(
    () => gscVoting && council?.gscVault(gscVoting.vault.address),
    [council, gscVoting],
  );
}
