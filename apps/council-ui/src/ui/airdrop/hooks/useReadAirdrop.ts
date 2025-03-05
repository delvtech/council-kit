import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/useReadCouncil";

/**
 * Use a ReadAirdrop instance for configured airdrop.
 */
export function useReadAirdrop() {
  const { airdrop } = useCouncilConfig();
  const council = useReadCouncil();

  return useMemo(
    () => airdrop && council?.airdrop(airdrop.address),
    [council, airdrop],
  );
}
