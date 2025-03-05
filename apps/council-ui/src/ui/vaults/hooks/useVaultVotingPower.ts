import { Address, RangeBlock } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { useReadCouncil } from "src/ui/council/useReadCouncil";
import { useAccount } from "wagmi";

interface UseVaultVotingPowerOptions {
  vaultAddress: Address;
  account?: Address;
  block?: RangeBlock;
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
  block,
}: UseVaultVotingPowerOptions) {
  const council = useReadCouncil();
  const { address: connectedAccount } = useAccount();
  const accountToUse = account ?? connectedAccount;
  const enabled = !!council && !!accountToUse;
  return useQuery({
    queryKey: ["vaultVotingPower", vaultAddress, account],
    enabled,
    queryFn: enabled
      ? () =>
          council
            .votingVault(vaultAddress)
            .getVotingPower({ voter: accountToUse, block })
            // Wagmi doesn't decode the uninitialized error, so we simply
            // return 0 if the the call fails.
            .catch(() => 0n)
      : undefined,
  });
}
