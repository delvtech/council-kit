import { BlockLike } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

interface UseVaultVotingPowerOptions {
  vaultAddress: `0x${string}`;
  account?: `0x${string}`;
  atBlock?: BlockLike;
}

/**
 * Get the voting power of a wallet in a specific vault.
 * @param account The account to get voting power for. If not provided, the
 * connected account will be used.
 * @param vaultAddress The address of the vault to get voting power for.
 */
export function useVaultVotingPower({
  vaultAddress,
  account,
  atBlock,
}: UseVaultVotingPowerOptions): {
  votingPower: bigint | undefined;
  votingPowerFormatted: string | undefined;
  status: QueryStatus;
} {
  const council = useReadCouncil();
  const { address: connectedAccount } = useAccount();
  const accountToUse = account ?? connectedAccount;

  const enabled = !!accountToUse;

  const { data, status } = useQuery({
    queryKey: ["vaultVotingPower", vaultAddress, account],
    enabled,
    queryFn: enabled
      ? () =>
          council
            .votingVault(vaultAddress)
            .getVotingPower({ account: accountToUse, atBlock })
      : undefined,
  });

  return {
    votingPower: data,
    /**
     * All voting power is formatted as a string with 18 decimal places.
     */
    votingPowerFormatted: data !== undefined ? formatEther(data) : undefined,
    status,
  };
}
