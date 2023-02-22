import { useQuery } from "@tanstack/react-query";
import assertNever from "assert-never";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVaultURL } from "src/routes";
import { Address } from "src/ui/base/Address";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import { useCouncil } from "src/ui/council/useCouncil";
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
      return <p>Error</p>;
    case "success": {
      const {
        vaultName,
        memberCount,
        connectedAccountMembershipStatus,
        sentenceSummary,
      } = gscVaultPreviewCardData;
      return (
        <Link href={makeVaultURL(vaultAddress)}>
          <div className="h-72 daisy-card bg-base-200 hover:shadow-xl transition-shadow ">
            <div className="daisy-card-body justify-between">
              <div>
                <h2 className="daisy-card-title text-2xl ">{vaultName}</h2>
                <Address address={vaultAddress} className="text-lg" />
                {/* Description */}
                <span className="mt-4 line-clamp-3" title={sentenceSummary}>
                  {sentenceSummary}
                </span>
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
            </div>
          </div>
        </Link>
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
  sentenceSummary?: string;
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

  const queryEnabled = !!gscVaultModel && !!gscVaultConfig;
  return useQuery<GSCVaultPreviewData>({
    queryKey: ["GSCVaultPreviewCard", gscVaultConfig?.address, account],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<GSCVaultPreviewData> => {
          return {
            vaultName: gscVaultConfig.name,
            memberCount: await (await gscVaultModel.getMembers()).length,
            connectedAccountMembershipStatus: gscStatus ?? "N/A",
            sentenceSummary: gscVaultConfig.sentenceSummary,
          };
        }
      : undefined,
  });
}
