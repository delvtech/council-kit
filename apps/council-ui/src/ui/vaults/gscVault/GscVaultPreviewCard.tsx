import { QueryStatus } from "@tanstack/react-query";
import assertNever from "assert-never";
import Link from "next/link";
import { ReactElement } from "react";
import { getGscVaultConfig } from "src/config/utils/getGscVaultConfig";
import { makeVaultURL } from "src/routes";
import { Address } from "src/ui/base/Address";
import { DefinitionTooltip } from "src/ui/base/Tooltip";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import { GenericVaultCardSkeleton } from "src/ui/vaults/GenericVaultCard";
import { useGscStatus } from "src/ui/vaults/gscVault/hooks/useGscStatus";
import { useAccount } from "wagmi";
import { useGscMembers } from "./hooks/useGscMembers";

interface GscVaultPreviewCardProps {
  vaultAddress: `0x${string}`;
}

export function GscVaultPreviewCard({
  vaultAddress,
}: GscVaultPreviewCardProps): ReactElement {
  const { address: account } = useAccount();
  const chainId = useSupportedChainId();
  const vaultConfig = getGscVaultConfig({ chainId });
  const name = vaultConfig?.name;
  const sentenceSummary = vaultConfig?.sentenceSummary;

  const { gscMembers, status: gscMembersQueryStatus } = useGscMembers();
  const {
    data: connectedAccountMembershipStatus,
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
          <div className="daisy-card h-72 bg-base-200 transition-shadow hover:shadow-xl">
            <div className="daisy-card-body justify-between">
              <div>
                <h2 className="daisy-card-title text-2xl">{name}</h2>
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
