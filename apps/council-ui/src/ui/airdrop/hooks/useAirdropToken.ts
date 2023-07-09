import { Token } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useCouncil } from "src/ui/council/useCouncil";

/**
 * Fetch the token for the airdrop.
 */
export function useAirdropToken(): UseQueryResult<Token | undefined> {
  const { airdrop } = useCouncil();
  return useQuery({
    queryKey: ["airdropToken", airdrop?.address],
    enabled: !!airdrop,
    queryFn: !!airdrop ? () => airdrop.getToken() : undefined,
  });
}
