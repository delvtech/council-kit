import { ReadCoreVoting } from "@delvtech/council-viem";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";

/**
 * Use a ReadCoreVoting instance for configured core voting contract.
 */
export function useReadCoreVoting(): ReadCoreVoting {
  const council = useReadCouncil();
  const { coreVoting } = useCouncilConfig();

  return useMemo(
    () =>
      council.coreVoting({
        address: coreVoting.address,
        vaults: coreVoting.vaults.map(({ address }) => address),
      }),
    [council, coreVoting.address, coreVoting.vaults],
  );
}
