import { Address } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";

/**
 * Fetch the token symbol for the given token address.
 * @param tokenAddress - The ReadToken or token address to fetch the symbol for
 */
export function useTokenSymbol(tokenAddress: Address | undefined) {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const enabled = !!tokenAddress && !!council;
  return useQuery({
    queryKey: ["useTokenSymbol", chainId, tokenAddress],
    enabled,
    queryFn: enabled
      ? () => council.token(tokenAddress).getSymbol()
      : undefined,
  });
}
