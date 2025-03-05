import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/useReadCouncil";

/**
 * Use a ReadGscVault instance for configured GSC vault.
 */
export function useReadGscVault() {
  const { gscVoting } = useCouncilConfig();
  const council = useReadCouncil();

  return useMemo(
    () => gscVoting && council?.gscVault(gscVoting.vaults[0].address),
    [council, gscVoting],
  );
}
