import { QueryStatus } from "@tanstack/react-query";
import assertNever from "assert-never";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVaultURL } from "src/routes";
import { Address } from "src/ui/base/Address";
import { DefinitionTooltip } from "src/ui/base/Tooltip";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { GenericVaultCardSkeleton } from "src/ui/vaults/GenericVaultCard";
import { useGscStatus } from "src/ui/vaults/gscVault/hooks/useGscStatus";
import { useAccount } from "wagmi";
import { useGscMembers } from "./hooks/useGscMembers";

interface GSCVaultPreviewCardProps {
  vaultAddress: `0x${string}`;
}

export function GSCVaultPreviewCard({
  vaultAddress,
}: GSCVaultPreviewCardProps): ReactElement {
  const { address: account } = useAccount();

  // config
  const config = useCouncilConfig();
  const name = config.gscVoting?.vault.name;
  const sentenceSummary = config.gscVoting?.vault.sentenceSummary;

  // members and status
  const { gscMembers, status: gscMembersQueryStatus } = useGscMembers();
  const {
    gscStatus: connectedAccountMembershipStatus,
    status: gscStatusQueryStatus,
  } = useGscStatus(account);

  const allQueryStatuses = [gscStatusQueryStatus, gscMembersQueryStatus];
  const queryStatus: QueryStatus = allQueryStatuses.includes("error")
    ? "error"
    : allQueryStatuses.includes("pending")
      ? "pending"
      : "success";

  switch (queryStatus) {
    case "pending":
      return <GenericVaultCardSkeleton />;
    case "error":
      // TODO: render an error card instead
      return <GenericVaultCardSkeleton />;
    case "success": {
      return (
        <Link href={makeVaultURL(vaultAddress)}>
          <div className="daisy-card h-72 bg-base-200 transition-shadow hover:shadow-xl ">
            <div className="daisy-card-body justify-between">
              <div>
                <h2 className="daisy-card-title text-2xl ">{name}</h2>
                <Address address={vaultAddress} className="text-lg" />
                {/* Description */}
                <span className="mt-4 line-clamp-3" title={sentenceSummary}>
                  {sentenceSummary}
                </span>
              </div>

              <div className="daisy-card-actions flex-col gap-y-2">
                {/* GSC Members */}
                <div className="flex w-full justify-between">
                  <span>GSC members:</span>
                  <span className="text-right font-bold">
                    <DefinitionTooltip content="The number of members currently residing on the Governance Steering Council.">
                      {gscMembers?.length || "None"}
                    </DefinitionTooltip>
                  </span>
                </div>

                {/* Your status */}
                <div className="flex w-full justify-between">
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
      assertNever(queryStatus);
  }
}
