import { useRouter } from "next/router";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { useChainId } from "src/ui/network/useChainId";
import { LockingVaultDetails } from "src/ui/vaults/LockingVaultDetails";
import { VestingVaultDetails } from "src/ui/vaults/VestingVaultDetails";

export default function Vault(): ReactElement {
  const {
    query: { address },
    replace,
  } = useRouter();

  const chainId = useChainId();
  const coreVotingConfig = councilConfigs[chainId].coreVoting;
  const vaultConfig = coreVotingConfig.vaults.find(
    (vault) => vault.address === address,
  );

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
