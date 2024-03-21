import { ReadLockingVault } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadAirdrop } from "src/ui/airdrop/hooks/useReadAirdrop";

/**
 * Fetch the locking vault for the configured airdrop.
 */
export function useAirdropVault(): {
  airdropVault: ReadLockingVault | undefined;
  status: QueryStatus;
} {
  const airdrop = useReadAirdrop();

  const { data, status } = useQuery({
    queryKey: ["useAirdropLockingVault"],
    enabled: !!airdrop,
    queryFn: !!airdrop ? () => airdrop.getLockingVault() : undefined,
  });

  return {
    airdropVault: data,
    status,
  };
}
