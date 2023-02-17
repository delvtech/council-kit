import assertNever from "assert-never";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Page } from "src/ui/base/Page";
import { useChainId } from "src/ui/network/useChainId";
import { FrozenLockingVaultDetails } from "src/ui/vaults/frozenLockingVault/FrozenLockingVaultDetails";
import { GSCVaultDetails } from "src/ui/vaults/gscVault/GSCVaultDetails";
import { LockingVaultDetails } from "src/ui/vaults/lockingVault/LockingVaultDetails";
import { VestingVaultDetails } from "src/ui/vaults/vestingVault/VestingVaultDetails";
import { getAllVaultConfigs } from "src/vaults/vaults";

export default function Vault(): ReactElement {
  const {
    query: { address },
    replace,
  } = useRouter();

  const chainId = useChainId();
  const allVaults = getAllVaultConfigs(chainId);
  const vaultConfig = allVaults.find((vault) => vault.address === address);

  if (!address || !vaultConfig) {
    replace("/vaults");
  }

  return (
    <Page>
      {(() => {
        if (!vaultConfig) {
          return;
        }
        switch (vaultConfig.type) {
          case "FrozenLockingVault":
            return <FrozenLockingVaultDetails address={address as string} />;

          case "LockingVault":
            return <LockingVaultDetails address={address as string} />;

          case "VestingVault":
            return <VestingVaultDetails address={address as string} />;

          case "GSCVault":
            return <GSCVaultDetails vaultAddress={address as string} />;

          default:
            assertNever(vaultConfig.type);
        }
      })()}
    </Page>
  );
}
