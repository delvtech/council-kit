import { Address } from "@delvtech/drift";
import { useQuery } from "@tanstack/react-query";
import { getVaultConfig } from "src/config/utils/getVaultConfig";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/council/useReadCouncil";

interface UseDelegatesByVaultOptions {
  account: Address | undefined;
  vaults?: Address[];
}

/**
 * Get an object representing a wallet's delegates by vault address.
 * @param account The account to get delegates for. If not provided, the
 * connected account will be used.
 */
export function useDelegatesByVault({
  account,
  vaults = [],
}: UseDelegatesByVaultOptions) {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const enabled = !!account && !!council;

  return useQuery({
    queryKey: ["delegates-by-vault", account, chainId, ...vaults],
    enabled,
    queryFn: enabled
      ? async () => {
          const delegatesByVault: {
            [vault: Address]: Address;
          } = {};

          await Promise.all(
            vaults.map(async (vault) => {
              const config = getVaultConfig({ address: vault, chainId });
              switch (config?.type) {
                case "FrozenLockingVault":
                case "LockingVault":
                  delegatesByVault[vault] = await council
                    .lockingVault(vault)
                    .getDelegate(account);
                  break;
                case "VestingVault":
                  delegatesByVault[vault] = await council
                    .vestingVault(vault)
                    .getDelegate(account);
                  break;
                default:
              }
            }),
          );

          return delegatesByVault;
        }
      : undefined,
  });
}
