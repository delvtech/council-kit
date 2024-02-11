import { ReadWriteCoreVoting } from "@delvtech/council-viem";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";

/**
 * Use a ReadWriteCoreVoting instance for configured core voting contract.
 */
export function useReadWriteCoreVoting(): ReadWriteCoreVoting | undefined {
  const council = useReadWriteCouncil();
  const { coreVoting } = useCouncilConfig();

  return useMemo(
    () =>
      council?.coreVoting({
        address: coreVoting.address,
        vaults: coreVoting.vaults.map(({ address }) => address),
      }),
    [council, coreVoting.address, coreVoting.vaults],
  );
}
