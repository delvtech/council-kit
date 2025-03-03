import { ReadAirdrop } from "@delvtech/council-viem";
import { useMemo } from "react";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";

/**
 * Use a ReadAirdrop instance for configured airdrop.
 */
export function useReadAirdrop(): ReadAirdrop | undefined {
  const { airdrop } = useCouncilConfig();
  const council = useReadCouncil();

  return useMemo(
    () => airdrop && council.airdrop(airdrop.address),
    [council, airdrop],
  );
}
