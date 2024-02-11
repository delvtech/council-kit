// import { ReactElement } from "react";
// import { formatBalance } from "src/ui/base/formatting/formatBalance";
// import { useClaimGrant } from "src/ui/vaults/vestingVault/hooks/useClaimGrant";

// interface GrantCardProps {
//   expirationDate: Date | undefined;
//   grantBalance: string;
//   grantBalanceWithdrawn: string;
//   unlockDate: Date | undefined;
//   vestingVaultAddress: `0x${string}`;
// }

// export function GrantCard({
//   expirationDate,
//   grantBalance,
//   grantBalanceWithdrawn,
//   unlockDate,
//   vestingVaultAddress,
// }: GrantCardProps): ReactElement {
//   const currentDate = new Date();
//   const { claimGrant } = useClaimGrant();

//   const grantExist = !!signer && parseEther(grantBalance).gt(0);
//   const canClaim =
//     unlockDate &&
//     unlockDate.getTime() < currentDate.getTime() &&
//     !!grantBalance;

//   if (!grantExist) {
//     return (
//       <div className="daisy-card flex h-fit flex-col gap-y-4 bg-base-200 p-4">
//         <div className="text-2xl font-bold">Your Vesting Info</div>

//         <p>There is no grant allocated for this account.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="daisy-card flex h-fit flex-col gap-y-4 bg-base-200 p-4">
//       <div className="text-2xl font-bold">Your Vesting Info</div>

//       <div className="flex flex-col gap-y-2">
//         <div className="flex">
//           <p>Grant Amount</p>
//           <p className="ml-auto font-bold">
//             {formatBalance(grantBalance)} ELFI
//           </p>
//         </div>

//         <div className="flex">
//           <p>Grant Claimed</p>
//           <p className="ml-auto font-bold">
//             {formatBalance(grantBalanceWithdrawn)} ELFI
//           </p>
//         </div>

//         {unlockDate && (
//           <div className="flex">
//             <p>Vesting Starts</p>
//             <p className="ml-auto font-bold">
//               {unlockDate.toLocaleDateString()}
//             </p>
//           </div>
//         )}

//         {expirationDate && (
//           <div className="flex">
//             <p>Vesting Ends</p>
//             <p className="ml-auto font-bold">
//               {expirationDate.toLocaleDateString()}
//             </p>
//           </div>
//         )}
//       </div>

//       {canClaim ? (
//         <button
//           className="daisy-btn daisy-btn-primary w-full"
//           onClick={() => claimGrant(vestingVaultAddress)}
//         >
//           Withdraw ELFI
//         </button>
//       ) : (
//         <div
//           className="daisy-tooltip"
//           data-tip="The vesting period has not started yet."
//         >
//           <button
//             className="daisy-btn daisy-btn-primary w-full"
//             disabled={true}
//           >
//             Withdraw ELFI
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
