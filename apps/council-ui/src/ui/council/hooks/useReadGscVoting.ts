import { ReadCoreVoting } from "@delvtech/council-viem";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";

/**
 * Use a ReadCoreVoting instance for the configured gsc voting contract.
 */
export function useReadGscVoting(): ReadCoreVoting | undefined {
  const council = useReadCouncil();
  const { gscVoting } = useCouncilConfig();

  return useMemo(() => {
    if (!gscVoting) {
      return undefined;
    }

    return council.coreVoting({
      address: gscVoting.address,
      vaults: [council.gscVault(gscVoting.vault.address)],
    });
  }, [council, gscVoting]);
}
