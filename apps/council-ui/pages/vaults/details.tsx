import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useChainId } from "src/ui/network/useChainId";
import { LockingVaultDetails } from "src/ui/vaults/variants/LockingVault/LockingVaultDetails";
import { VestingVaultDetails } from "src/ui/vaults/variants/VestingVault/VestingVaultDetails";
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
    <div>
      {(() => {
        switch (vaultConfig?.type) {
          case "LockingVault":
            return <LockingVaultDetails address={address as string} />;

          case "VestingVault":
            return <VestingVaultDetails address={address as string} />;

          case "GSCVault":
            return <></>;

          default:
            return <></>;
        }
      })()}
    </div>
  );
}
