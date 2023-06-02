import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Page } from "src/ui/base/Page";
import { useChainId } from "src/ui/network/useChainId";
import { FrozenLockingVaultDetails } from "src/ui/vaults/frozenLockingVault/FrozenLockingVaultDetails";
import { GenericVaultDetails } from "src/ui/vaults/genericVault/GenericVaultDetails";
import { GSCVaultDetails } from "src/ui/vaults/gscVault/GSCVaultDetails";
import { LockingVaultDetails } from "src/ui/vaults/lockingVault/LockingVaultDetails";
import { VestingVaultDetails } from "src/ui/vaults/vestingVault/VestingVaultDetails";
import { getVaultConfig } from "src/vaults/vaults";

export default function Vault(): ReactElement {
  const {
    query: { address },
    replace,
  } = useRouter();

  const chainId = useChainId();
  const vaultConfig = getVaultConfig(address?.toString() || "", chainId);

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
            return <GSCVaultDetails address={address as string} />;

          default:
            return <GenericVaultDetails address={address as string} />;
        }
      })()}
    </Page>
  );
}
