import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/useReadCouncil";

/**
 * Fetch the locking vault for the configured airdrop.
 */
export function useAirdropVault({
  chainId,
}: { chainId?: SupportedChainId } = {}) {
  const { airdrop } = useCouncilConfig(chainId);
  const council = useReadCouncil({ chainId });
  const enabled = !!airdrop && !!council;
  return useQuery({
    queryKey: ["airdropVault", chainId],
    enabled,
    queryFn: !!enabled
      ? () => council.airdrop(airdrop.address).getLockingVault()
      : undefined,
  });
}
