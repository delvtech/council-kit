// import { useRouter } from "next/router";
// import { ReactElement } from "react";
// import { Page } from "src/ui/base/Page";
// import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
// import { FrozenLockingVaultDetails } from "src/ui/vaults/frozenLockingVault/FrozenLockingVaultDetails";
// import { GenericVaultDetails } from "src/ui/vaults/genericVault/GenericVaultDetails";
// import { GscVaultDetails } from "src/ui/vaults/gscVault/GscVaultDetails";
// import { LockingVaultDetails } from "src/ui/vaults/lockingVault/LockingVaultDetails";
// import { VestingVaultDetails } from "src/ui/vaults/vestingVault/VestingVaultDetails";
// import { getVaultConfig } from "src/vaults/vaults";

import { ReactElement } from "react";

export default function VaultPage(): ReactElement {
  return <div>VaultPage</div>;
}

// export default function VaultPage(): ReactElement {
//   const {
//     query: { address },
//     replace,
//   } = useRouter();

//   const chainId = useSupportedChainId();
//   const vaultConfig = getVaultConfig(address?.toString() || "", chainId);

//   if (!address || !vaultConfig) {
//     replace("/vaults");
//   }

//   return (
//     <Page>
//       {(() => {
//         if (!vaultConfig) {
//           return;
//         }
//         switch (vaultConfig.type) {
//           case "FrozenLockingVault":
//             return <FrozenLockingVaultDetails address={address as string} />;

//           case "LockingVault":
//             return <LockingVaultDetails address={address as string} />;

//           case "VestingVault":
//             return <VestingVaultDetails address={address as string} />;

//           case "GSCVault":
//             return <GscVaultDetails address={address as string} />;

//           default:
//             return <GenericVaultDetails address={address as string} />;
//         }
//       })()}
//     </Page>
//   );
// }
