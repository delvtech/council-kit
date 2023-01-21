import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Page } from "src/ui/base/Page";
import { useChainId } from "src/ui/network/useChainId";
import { GSCVaultDetails } from "src/ui/vaults/gscVault/GSCVaultDetails";
import { LockingVaultDetails } from "src/ui/vaults/lockingVault/LockingVaultDetails";
import { VestingVaultDetails } from "src/ui/vaults/vestingVault/VestingVaultDetails";
import { getAllVaults } from "src/vaults/vaults";

export default function Vault(): ReactElement {
  const {
    query: { address },
    replace,
  } = useRouter();

  const chainId = useChainId();
  const allVaults = getAllVaults(chainId);
  const vaultConfig = allVaults.find((vault) => vault.address === address);

  if (!address || !vaultConfig) {
    replace("/404");
  }

  return (
    <Page>
      {(() => {
        switch (vaultConfig?.type) {
          case "LockingVault":
            return <LockingVaultDetails address={address as string} />;

          case "VestingVault":
            return <VestingVaultDetails address={address as string} />;

          case "GSCVault":
            return <GSCVaultDetails gscVaultAddress={address as string} />;

          default:
            return <></>;
        }
      })()}
    </Page>
  );
}
