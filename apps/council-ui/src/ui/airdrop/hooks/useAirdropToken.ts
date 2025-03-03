import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";

/**
 * Fetch the token for the configured airdrop.
 */
export function useAirdropToken({
  chainId,
}: { chainId?: SupportedChainId } = {}) {
  const { airdrop } = useCouncilConfig({ chainId });
  const council = useReadCouncil({ chainId });
  const enabled = !!airdrop && !!council;
  return useQuery({
    queryKey: ["airdropToken", airdrop?.address],
    enabled,
    queryFn: !!airdrop
      ? () => council.airdrop(airdrop.address).getToken()
      : undefined,
  });
}
