import { ReadToken } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadAirdrop } from "src/ui/airdrop/hooks/useReadAirdrop";

/**
 * Fetch the token for the configured airdrop.
 */
export function useAirdropToken(): {
  airdropToken: ReadToken | undefined;
  status: QueryStatus;
} {
  const airdrop = useReadAirdrop();

  const { data, status } = useQuery({
    queryKey: ["airdropToken", airdrop?.address],
    enabled: !!airdrop,
    queryFn: !!airdrop ? () => airdrop.getToken() : undefined,
  });

  return {
    airdropToken: data,
    status,
  };
}
