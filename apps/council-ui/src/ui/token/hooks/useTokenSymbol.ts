import { Token } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

/**
 * Fetch the token symbol for the given token address.
 * @param tokenAddress - The token address to fetch the symbol for
 */
export function useTokenSymbol(
  tokenAddress: string | undefined,
): UseQueryResult<string | undefined> {
  const { context } = useCouncil();
  return useQuery({
    queryKey: ["tokenSymbol", tokenAddress],
    enabled: !!tokenAddress,
    queryFn: !!tokenAddress
      ? () => {
          const token = new Token(tokenAddress, context);
          return token.getSymbol();
        }
      : undefined,
  });
}
