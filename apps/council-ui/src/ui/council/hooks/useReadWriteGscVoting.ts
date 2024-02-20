import { ReadWriteCoreVoting } from "@delvtech/council-viem";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";

/**
 * Use a ReadWriteCoreVoting instance for configured gsc voting contract.
 */
export function useReadWriteGscVoting(): ReadWriteCoreVoting | undefined {
  const council = useReadWriteCouncil();
  const { gscVoting } = useCouncilConfig();

  return useMemo(
    () =>
      gscVoting &&
      council?.coreVoting({
        address: gscVoting.address,
        vaults: [council.gscVault(gscVoting?.vault.address)],
      }),
    [council, gscVoting],
  );
}
