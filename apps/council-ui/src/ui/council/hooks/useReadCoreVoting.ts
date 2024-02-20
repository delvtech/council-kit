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
  // const ref = useRef<string>();

  // useEffect(() => {
  //   console.log('council changed')
  // }, [council])

  // useEffect(() => {
  //   console.log('coreVoting.address changed from', ref.current, 'to', coreVoting.address)

  // }, [coreVoting.address])

  // useEffect(() => {
  //   console.log('coreVoting.vaults changed')
  // }, [coreVoting.vaults])

  return useMemo(() => {
    // console.log("Making new coreVoting with vaults:", coreVoting.vaults);
    return council.coreVoting({
      address: coreVoting.address,
      vaults: coreVoting.vaults.map((vault) => {
        switch (vault.type) {
          case "LockingVault":
            return council.lockingVault(vault.address);
          case "VestingVault":
            return council.vestingVault(vault.address);
          default:
            return vault.address;
        }
      }),
    });
  }, [council, coreVoting.address, coreVoting.vaults]);
}
