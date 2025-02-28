import { ReadWriteAirdrop } from "@delvtech/council-js";
import { useMemo } from "react";
import { SupportedChainId } from "src/config/council.config";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadWriteCouncil } from "src/ui/sdk/hooks/useReadWriteCouncil";

/**
 * Use a ReadWriteAirdrop instance for configured airdrop.
 */
export function useReadWriteAirdrop({
  chainId,
}: {
  chainId?: SupportedChainId;
} = {}): ReadWriteAirdrop | undefined {
  const { airdrop } = useCouncilConfig(chainId);
  const council = useReadWriteCouncil({ chainId });

  return useMemo(
    () => airdrop && council?.airdrop(airdrop.address),
    [council, airdrop],
  );
}
