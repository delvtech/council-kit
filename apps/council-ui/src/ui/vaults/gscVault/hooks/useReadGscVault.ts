import { ReadGscVault } from "@delvtech/council-js";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";

/**
 * Use a ReadGscVault instance for configured GSC vault.
 */
export function useReadGscVault(): ReadGscVault | undefined {
  const { gscVoting } = useCouncilConfig();
  const council = useReadCouncil();

  return useMemo(
    () => gscVoting && council.gscVault(gscVoting.vault.address),
    [council, gscVoting],
  );
}
