import { Address } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { SupportedChainId } from "src/config/council.config";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";

/**
 * Fetch the token decimals for the given token address.
 */
export function useTokenDecimals({
  tokenAddress,
  chainId,
}: { tokenAddress?: Address; chainId?: SupportedChainId } = {}) {
  const council = useReadCouncil({ chainId });
  const enabled = !!tokenAddress;
  return useQuery({
    queryKey: ["useTokenDecimals", chainId, tokenAddress],
    enabled,
    queryFn: enabled
      ? () => council.token(tokenAddress).getDecimals()
      : undefined,
  });
}
