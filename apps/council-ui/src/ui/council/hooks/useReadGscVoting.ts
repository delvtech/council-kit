import { ReadCoreVoting } from "@delvtech/council-viem";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";

/**
 * Use a ReadCoreVoting instance for configured gsc voting contract.
 */
export function useReadGscVoting(): ReadCoreVoting | undefined {
  const council = useReadCouncil();
  const { gscVoting } = useCouncilConfig();

  return useMemo(
    () =>
      gscVoting &&
      council.coreVoting({
        address: gscVoting.address,
        vaults: [gscVoting.vault.address],
      }),

    [council, gscVoting],
  );
}
