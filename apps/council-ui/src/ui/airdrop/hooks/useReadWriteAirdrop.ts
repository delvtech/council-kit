import { ReadWriteAirdrop } from "@delvtech/council-viem";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadWriteCouncil } from "src/ui/council/hooks/useReadWriteCouncil";

/**
 * Use a ReadWriteAirdrop instance for configured airdrop.
 */
export function useReadWriteAirdrop(): ReadWriteAirdrop | undefined {
  const { airdrop } = useCouncilConfig();
  const council = useReadWriteCouncil();

  return useMemo(
    () => airdrop && council?.airdrop(airdrop.address),
    [council, airdrop],
  );
}
