import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Page } from "src/ui/base/Page";
import { useVaultConfig } from "src/ui/config/hooks/useVaultConfig";
import { FrozenLockingVaultDetails } from "src/ui/vaults/frozenLockingVault/FrozenLockingVaultDetails";
import { GenericVaultDetails } from "src/ui/vaults/genericVault/GenericVaultDetails";
import { GscVaultDetails } from "src/ui/vaults/gscVault/GSCVaultDetails";
import { LockingVaultDetails } from "src/ui/vaults/lockingVault/LockingVaultDetails";
// import { VestingVaultDetails } from "src/ui/vaults/vestingVault/VestingVaultDetails";

export default function VaultPage(): ReactElement {
  const { query, replace } = useRouter();
  const address = query.address as `0x${string}` | undefined;

  const vaultConfig = useVaultConfig(address);

  if (!address || !vaultConfig) {
    replace("/vaults");
  }

  return (
    <Page>
      {(() => {
        if (!address || !vaultConfig) {
          return;
        }
        switch (vaultConfig.type) {
          case "FrozenLockingVault":
            return <FrozenLockingVaultDetails address={address} />;

          case "LockingVault":
            return <LockingVaultDetails address={address} />;

          case "VestingVault":
            // return <VestingVaultDetails address={address} />;
            return <p>Vesting Vault</p>;

          case "GSCVault":
            return <GscVaultDetails address={address} />;

          default:
            return <GenericVaultDetails address={address} />;
        }
      })()}
    </Page>
  );
}
