import { Address, RangeBlock } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import { getVotingPower } from "src/utils/vaults/getVotingPower";
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
  const { address: connectedAccount } = useAccount();
  const accountToUse = account ?? connectedAccount;
  const enabled = !!accountToUse;
  const chainId = useSupportedChainId();
  return useQuery({
    queryKey: ["vaultVotingPower", vaultAddress, account],
    enabled,
    queryFn: enabled
      ? () =>
          getVotingPower({
            chainId,
            vault: vaultAddress,
            voter: accountToUse,
            block,
          })
      : undefined,
  });
}
