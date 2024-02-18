import Link from "next/link";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeVaultURL } from "src/routes";
import { Address } from "src/ui/base/Address";
import { DefinitionTooltip } from "src/ui/base/Tooltip";
import { formatUnitsBalance } from "src/ui/base/formatting/formatUnitsBalance";
import { TVP_TIP } from "src/ui/vaults/tooltips";

interface GenericVaultCardProps {
  address: `0x${string}`;
  name: string;
  tvp?: bigint;
  votingPower?: bigint;
  sentenceSummary?: string;
}

export function GenericVaultCard({
  address,
  name,
  tvp,
  votingPower,
  sentenceSummary,
}: GenericVaultCardProps): ReactElement {
  return (
    <Link href={makeVaultURL(address)}>
      <div className="daisy-card h-72 bg-base-200 transition-shadow hover:shadow-xl">
        <div className="daisy-card-body justify-between">
          <div>
            <h2 className="daisy-card-title text-2xl">{name}</h2>
            <Address address={address} className="text-lg" />
            {/* Description */}
            <span className="mt-4 line-clamp-3" title={sentenceSummary}>
              {sentenceSummary}
            </span>
          </div>

          <div className="daisy-card-actions flex-col gap-y-2">
            {/* Total Voting Power */}
            <div className="flex w-full justify-between">
              <span>
                <DefinitionTooltip content={TVP_TIP}>
                  Total voting power:
                </DefinitionTooltip>
              </span>
              <span className="font-bold">
                {tvp ? formatUnitsBalance({ balance: tvp }) : "None"}
              </span>
            </div>

            <div className="flex w-full justify-between">
              <span>Your voting power:</span>
              <span className="font-bold">
                {votingPower
                  ? formatUnitsBalance({ balance: votingPower })
                  : "None"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function GenericVaultCardSkeleton(): ReactElement {
  return (
    <div className="daisy-card w-full bg-base-300 sm:h-72 sm:w-80">
      <div className="daisy-card-body gap-6">
        <h2 className="w-32">
          <Skeleton count={2} />
        </h2>

        <div className="daisy-card-actions flex-col gap-y-6">
          <div className="w-full">
            <Skeleton count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
