import { ReadToken } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";

/**
 * Fetch the token name for the given token address.
 * @param token - A ReadToken or the token address to fetch the name for
 */
export function useTokenName(token: ReadToken | `0x${string}` | undefined): {
  name: string | undefined;
  status: QueryStatus;
} {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const tokenInstance =
    typeof token === "string" ? council.token(token) : token;

  const { data, status } = useQuery({
    queryKey: ["useTokenName", chainId, token],
    enabled: !!tokenInstance,
    queryFn: !!tokenInstance ? () => tokenInstance.getName() : undefined,
  });

  return {
    name: data,
    status,
  };
}
