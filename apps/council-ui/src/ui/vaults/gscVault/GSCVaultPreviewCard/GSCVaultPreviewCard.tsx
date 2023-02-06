import { useQuery } from "@tanstack/react-query";
import assertNever from "assert-never";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVaultURL } from "src/routes";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import { useCouncil } from "src/ui/council/useCouncil";
import { AddressWithEtherscan } from "src/ui/ens/Address";
import { useChainId } from "src/ui/network/useChainId";
import { GenericVaultCardSkeleton } from "src/ui/vaults/GenericVaultCard";
import { useGSCStatus } from "src/ui/vaults/gscVault/useGSCStatus";
import { GSCStatus } from "src/vaults/gscVault/types";
import { getGSCCoreVotingVaults } from "src/vaults/vaults";
import { useAccount } from "wagmi";

interface GSCVaultPreviewCardProps {
  vaultAddress: string;
}

export function GSCVaultPreviewCard({
  vaultAddress,
}: GSCVaultPreviewCardProps): ReactElement {
  const { data: gscVaultPreviewCardData, status } =
    useGSCVaultPreviewCard(vaultAddress);

  switch (status) {
    case "loading":
      return <GenericVaultCardSkeleton />;
    case "error":
      // TODO: render an error card instead
      return <GenericVaultCardSkeleton />;
    case "success": {
      const { vaultName, memberCount, connectedAccountMembershipStatus } =
        gscVaultPreviewCardData;
      return (
        <div className="daisy-card w-full sm:w-80 sm:h-72 bg-base-300">
          <div className="daisy-card-body justify-between">
            <div>
              <h2 className="daisy-card-title text-2xl ">{vaultName}</h2>
              <AddressWithEtherscan
                address={vaultAddress}
                className="text-lg"
              />
            </div>

            <div className="daisy-card-actions flex-col gap-y-2">
              {/* GSC Members */}
              <div className="flex justify-between w-full">
                <span>GSC members:</span>
                <span className="font-bold text-right">
                  <DefinitionTooltip content="The number of members currently residing on the Governance Steering Council.">
                    {memberCount ? formatBalance(memberCount) : "None"}
                  </DefinitionTooltip>
                </span>
              </div>

              {/* Your status */}
              <div className="flex justify-between w-full">
                <span>Your status:</span>
                <span className="font-bold">
                  {connectedAccountMembershipStatus}
                </span>
              </div>
            </div>
            <Link href={makeVaultURL(vaultAddress)}>
              <button className="daisy-btn daisy-btn-primary">Open</button>
            </Link>
          </div>
        </div>
      );
    }
    default:
      assertNever(status);
  }
}

interface GSCVaultPreviewData {
  vaultName: string;
  memberCount: number;
  connectedAccountMembershipStatus: GSCStatus;
}
function useGSCVaultPreviewCard(gscVaultAddress: string) {
  const { gscVoting } = useCouncil();
  const chainId = useChainId();
  const { address: account } = useAccount();
  const { data: gscStatus } = useGSCStatus(account);

  const gscVaultConfig = getGSCCoreVotingVaults(chainId).find(
    ({ address }) => gscVaultAddress === address,
  );
  const gscVaultModel = gscVoting?.vaults.find(
    ({ address }) => gscVaultAddress === address,
  );

  const queryEnabled =
    !!gscVaultModel && !!account && !!gscVaultConfig && !!gscStatus;
  return useQuery<GSCVaultPreviewData>({
    queryKey: ["GSCVaultPreviewCard", gscVaultConfig?.address, account],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<GSCVaultPreviewData> => {
          return {
            vaultName: gscVaultConfig.name,
            memberCount: await (await gscVaultModel.getMembers()).length,
            connectedAccountMembershipStatus: gscStatus,
          };
        }
      : undefined,
  });
}
