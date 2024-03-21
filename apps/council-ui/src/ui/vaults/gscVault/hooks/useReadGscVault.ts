import { ReadGscVault } from "@delvtech/council-viem";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";

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
