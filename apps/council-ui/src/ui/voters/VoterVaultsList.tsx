// import { useQuery, UseQueryResult } from "@tanstack/react-query";
// import { ReactElement } from "react";
// import { formatAddress } from "src/ui/base/formatting/formatAddress";
// import { formatBalance } from "src/ui/base/formatting/formatBalance";
// import { useCouncil } from "src/ui/council/useCouncil";
// import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
// import { GSCVaultProfileCard } from "src/ui/vaults/gscVault/GscVaultProfileCard";
// import { useVaultVotingPower } from "src/ui/vaults/hooks/useVaultVotingPower";
// import { LockingVaultProfileCard } from "src/ui/vaults/lockingVault/LockingVaultsProfileCard";
// import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
// import { VaultProfileCardSkeleton } from "src/ui/vaults/VaultProfileCardSkeleton";
// import { VestingVaultProfileCard } from "src/ui/vaults/vestingVault/VestingVaultProfileCard";
// import { getIsGscEligible } from "src/vaults/gscVault/getIsGscEligible";
// import { getVaultConfig } from "src/vaults/vaults";

// interface VoterVaultsListProps {
//   address: string;
// }

// export function VoterVaultsList({
//   address,
// }: VoterVaultsListProps): ReactElement {
//   const { coreVoting, gscVoting } = useCouncil();
//   const { data: isGSCRelevant } = useIsGSCRelevant(address);

//   const chainId = useSupportedChainId();

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row w-full gap-6">
//       {/* core voting vaults */}
//       {coreVoting.vaults.map((vault) => {
//         const config = getVaultConfig(vault.address, chainId);

//         switch (config?.type) {
//           case "LockingVault":
//           case "FrozenLockingVault":
//             return (
//               <LockingVaultProfileCard
//                 key={vault.address}
//                 address={vault.address}
//                 profileAddress={address}
//               />
//             );
//           case "VestingVault":
//             return (
//               <VestingVaultProfileCard
//                 key={vault.address}
//                 address={vault.address}
//                 profileAddress={address}
//               />
//             );
//           default:
//             return (
//               <DefaultVaultProfileCard
//                 address={address}
//                 profileAddress={address}
//               />
//             );
//         }
//       })}

//       {/* gsc vault */}
//       {isGSCRelevant && !!gscVoting && (
//         <GSCVaultProfileCard
//           address={gscVoting.vaults[0].address}
//           profileAddress={address}
//         />
//       )}
//     </div>
//   );
// }

// /**
//  * Get a boolean indicating that the GSC is relevant to this voter because they
//  * are either a member or eligible.
//  */
// function useIsGSCRelevant(address: string): UseQueryResult<boolean> {
//   const { coreVoting, gscVoting } = useCouncil();
//   return useQuery({
//     queryKey: ["is-gsc-relevant", address],
//     queryFn: async () => {
//       if (!gscVoting) {
//         return false;
//       }
//       if (await gscVoting.getIsMember(address)) {
//         return true;
//       }
//       return getIsGscEligible({ address, coreVoting, gscVoting });
//     },
//   });
// }

// interface DefaultVaultProfileCardProps {
//   address: string;
//   profileAddress: string;
// }

// function DefaultVaultProfileCard({
//   address,
//   profileAddress,
// }: DefaultVaultProfileCardProps) {
//   const { data: votingPower } = useVaultVotingPower(address, profileAddress);
//   const name = `Voting Vault ${formatAddress(address)}`;

//   if (!votingPower) {
//     return <VaultProfileCardSkeleton address={address} name={name} />;
//   }

//   return (
//     <VaultProfileCard
//       address={address}
//       name={name}
//       stats={[
//         {
//           label: "Voting Power",
//           value: +votingPower ? formatBalance(votingPower) : "None",
//         },
//       ]}
//     />
//   );
// }
