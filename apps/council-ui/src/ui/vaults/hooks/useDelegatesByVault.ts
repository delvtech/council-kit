import {
  BlockLike,
  ReadLockingVault,
  ReadVestingVault,
  ReadVoter,
  ReadVotingVault,
} from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useAccount } from "wagmi";

interface UseDelegatesByVaultOptions {
  vaults?: (ReadVotingVault | `0x${string}`)[];
  account?: `0x${string}`;
  atBlock?: BlockLike;
}

/**
 * Get an object representing a wallet's delegates by vault address.
 * @param account The account to get delegates for. If not provided, the
 * connected account will be used.
 */
export function useDelegatesByVault({
  vaults: _vaults,
  account,
  atBlock,
}: UseDelegatesByVaultOptions = {}): {
  delegatesByVault: Record<`0x${string}`, ReadVoter> | undefined;
  status: QueryStatus;
} {
  const chainId = useSupportedChainId();
  const vaultConfigs = useCouncilConfig().coreVoting.vaults;
  const council = useReadCouncil();
  const coreVoting = useReadCoreVoting();

  const { address: connectedAccount } = useAccount();
  const accountToUse = account ?? connectedAccount;

  const enabled = !!accountToUse;

  const { data, status } = useQuery({
    queryKey: ["delegates-by-vault", accountToUse, chainId],
    enabled,
    queryFn: enabled
      ? async () => {
          const delegatesByVault: Record<`0x${string}`, ReadVoter> = {};

          const vaults =
            _vaults?.map((vault) =>
              typeof vault === "string" ? council.votingVault(vault) : vault,
            ) || coreVoting.vaults;

          for (const vault of vaults) {
            const config = vaultConfigs.find(
              ({ address }) => address === vault.address,
            );

            let typedDelegationVault:
              | ReadLockingVault
              | ReadVestingVault
              | undefined;

            switch (config?.type) {
              case "FrozenLockingVault":
              case "LockingVault":
              case "VestingVault":
                typedDelegationVault = vault as ReadVestingVault;
                break;
              case "GSCVault":
              // GSCVault does not have delegation, do nothing
              default:
            }

            if (typedDelegationVault) {
              const delegate = await typedDelegationVault.getDelegate({
                account: accountToUse,
                atBlock,
              });
              delegatesByVault[vault.address] = delegate;
            }
          }

          return delegatesByVault;
        }
      : undefined,
  });

  return {
    delegatesByVault: data,
    status,
  };
}
