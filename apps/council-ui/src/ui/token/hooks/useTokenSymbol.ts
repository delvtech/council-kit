import { ReadToken } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";

/**
 * Fetch the token symbol for the given token address.
 * @param tokenAddress - The ReadToken or token address to fetch the symbol for
 */
export function useTokenSymbol(token: ReadToken | `0x${string}` | undefined): {
  symbol: string | undefined;
  status: QueryStatus;
} {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const tokenInstance =
    typeof token === "string" ? council.token(token) : token;

  const { data, status } = useQuery({
    queryKey: ["useTokenSymbol", chainId, token],
    enabled: !!tokenInstance,
    queryFn: !!tokenInstance ? () => tokenInstance.getSymbol() : undefined,
  });

  return {
    symbol: data,
    status,
  };
}
