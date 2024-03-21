import { ReadToken } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";

/**
 * Fetch the token decimals for the given token address.
 * @param token - The ReadToken or token address to fetch the decimals for
 */
export function useTokenDecimals(
  token: ReadToken | `0x${string}` | undefined,
): {
  decimals: number | undefined;
  status: QueryStatus;
} {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const tokenInstance =
    typeof token === "string" ? council.token(token) : token;

  const { data, status } = useQuery({
    queryKey: ["useTokenName", chainId, token],
    enabled: !!tokenInstance,
    queryFn: !!tokenInstance ? () => tokenInstance.getDecimals() : undefined,
  });

  return {
    decimals: data,
    status,
  };
}
