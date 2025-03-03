import { Address } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";

/**
 * Fetch the token name for the given token address.
 */
export function useTokenName(tokenAddress: Address | undefined) {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const enabled = !!tokenAddress;
  return useQuery({
    queryKey: ["useTokenName", chainId, tokenAddress],
    enabled,
    queryFn: enabled ? () => council.token(tokenAddress).getName() : undefined,
  });
}
