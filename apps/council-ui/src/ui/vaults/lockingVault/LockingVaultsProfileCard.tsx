// import { LockingVault, VoterPowerBreakdown } from "@council/sdk";
// import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
// import { useQuery } from "@tanstack/react-query";
// import { constants } from "ethers";
// import Link from "next/link";
// import { ReactElement } from "react";
// import { makeVoterURL } from "src/routes";
// import { formatBalance } from "src/ui/base/formatting/formatBalance";
// import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
// import { Tooltip } from "src/ui/base/Tooltip/Tooltip";
// import { WalletIcon } from "src/ui/base/WalletIcon";
// import { useCouncil } from "src/ui/council/useCouncil";
// import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
// import { DelegatorListModal } from "src/ui/vaults/DelegatorListModal";
// import { useChangeDelegate } from "src/ui/vaults/lockingVault/hooks/useChangeDelegate";
// import { useDelegate } from "src/ui/vaults/lockingVault/hooks/useDelegate";
// import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
// import { VaultProfileCardSkeleton } from "src/ui/vaults/VaultProfileCardSkeleton";
// import { getVaultConfig } from "src/vaults/vaults";
// import { useAccount, useSigner } from "wagmi";

// interface LockingVaultProfileCardProps {
//   address: string;
//   profileAddress: string;
// }

// export function LockingVaultProfileCard({
//   address,
//   profileAddress,
// }: LockingVaultProfileCardProps): ReactElement {
//   // data
//   const { data } = useLockingVaultProfileCardData(address, profileAddress);
//   const profileName = useDisplayName(profileAddress);
//   const delegateName = useDisplayName(data?.delegate.address);
//   const { address: account } = useAccount();
//   const { data: accountDelegate } = useDelegate(address, account);

//   // config
//   const chainId = useSupportedChainId();
//   const config = getVaultConfig(address, chainId);
//   const name = config?.name || "Locking Vault";

//   // delegate transaction
//   const { data: signer } = useSigner();
//   const { mutate: changeDelegate } = useChangeDelegate(address);

//   if (!data) {
//     return <VaultProfileCardSkeleton address={address} name={name} />;
//   }

//   const {
//     balance,
//     tokenSymbol,
//     votingPowerBreakdown,
//     delegate,
//     delegateIsGSCMember,
//   } = data || {};

//   return (
//     <VaultProfileCard
//       address={address}
//       name={name}
//       stats={[
//         {
//           label: "Tokens Deposited",
//           value: +balance ? `${formatBalance(balance)} ${tokenSymbol}` : "None",
//         },
//         {
//           label: "Voting Power",
//           value:
//             votingPowerBreakdown && +votingPowerBreakdown.votingPower
//               ? formatBalance(votingPowerBreakdown.votingPower)
//               : "None",
//         },
//         {
//           label: "Current Delegate",
//           value:
//             delegate.address === constants.AddressZero ? (
//               "None"
//             ) : (
//               <Link
//                 href={makeVoterURL(delegate.address)}
//                 className="flex items-center hover:underline"
//               >
//                 <WalletIcon
//                   className="mr-1"
//                   address={delegate.address}
//                   size={16}
//                 />
//                 {delegateName}
//                 {delegateIsGSCMember && (
//                   <Tooltip content="GSC Member">
//                     <BuildingLibraryIcon className="w-5 h-5 ml-1 fill-warning" />
//                   </Tooltip>
//                 )}
//               </Link>
//             ),
//         },
//         {
//           label: "# of Delegators",
//           value: votingPowerBreakdown?.delegators.length ? (
//             <>
//               <label
//                 htmlFor={`delegator-modal-${address}`}
//                 className="underline hover:no-underline hover:cursor-pointer text-secondary"
//               >
//                 {votingPowerBreakdown.delegators.length}
//               </label>
//               <DelegatorListModal
//                 id={`delegator-modal-${address}`}
//                 delegators={votingPowerBreakdown.delegators}
//                 delegateAddress={profileAddress}
//                 delegateName={profileName}
//               />
//             </>
//           ) : (
//             "None"
//           ),
//         },
//       ]}
//       button={{
//         text: "Delegate",
//         disabled: !signer || accountDelegate?.address === profileAddress,
//         onClick: () =>
//           signer && changeDelegate({ delegate: profileAddress, signer }),
//       }}
//     />
//   );
// }

// function useLockingVaultProfileCardData(
//   address: string,
//   profileAddress: string,
// ) {
//   const { context, gscVoting } = useCouncil();
//   return useQuery({
//     queryKey: ["locking-vault-profile-card", address, profileAddress],
//     queryFn: async () => {
//       const lockingVault = new LockingVault(address, context);
//       const votingPowerBreakdowns = await lockingVault.getVotingPowerBreakdown(
//         profileAddress,
//       );

//       const token = await lockingVault.getToken();
//       const delegate = await lockingVault.getDelegate(profileAddress);

//       return {
//         balance: await lockingVault.getDepositedBalance(profileAddress),
//         tokenSymbol: await token.getSymbol(),
//         votingPowerBreakdown: votingPowerBreakdowns[0] as
//           | VoterPowerBreakdown
//           | undefined,
//         delegate,
//         delegateIsGSCMember:
//           gscVoting && (await gscVoting.getIsMember(delegate.address)),
//       };
//     },
//   });
// }
