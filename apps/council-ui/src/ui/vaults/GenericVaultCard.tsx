import Link from "next/link";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeVaultURL } from "src/routes";
import { Address } from "src/ui/base/Address";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import { TVP_TIP } from "src/ui/vaults/tooltips";

interface GenericVaultCardProps {
  address: string;
  name: string;
  tvp?: string;
  votingPower?: string;
}

export function GenericVaultCard({
  address,
  name,
  tvp,
  votingPower,
}: GenericVaultCardProps): ReactElement {
  return (
    <Link href={makeVaultURL(address)}>
      <div className="w-80 h-72 daisy-card bg-base-300 hover:shadow-xl transition-shadow">
        <div className="daisy-card-body justify-between">
          <div>
            <h2 className="text-2xl daisy-card-title">{name}</h2>
            <Address address={address} className="text-lg" />
          </div>

          <div className="flex-col daisy-card-actions gap-y-2">
            {/* Total Voting Power */}
            <div className="flex justify-between w-full">
              <span>
                <DefinitionTooltip content={TVP_TIP}>
                  Total voting power:
                </DefinitionTooltip>
              </span>
              <span className="font-bold">
                {tvp ? formatBalance(tvp) : "None"}
              </span>
            </div>

            <div className="flex justify-between w-full">
              <span>Your voting power:</span>
              <span className="font-bold">
                {votingPower ? formatBalance(votingPower) : "None"}
              </span>
            </div>
          </div>
          <div>
            <button className="daisy-btn daisy-btn-primary">Open</button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function GenericVaultCardSkeleton(): ReactElement {
  return (
    <div className="w-full sm:w-80 sm:h-72 daisy-card bg-base-300">
      <div className="daisy-card-body gap-6">
        <h2 className="w-32">
          <Skeleton count={2} />
        </h2>

        <div className="flex-col daisy-card-actions gap-y-6">
          <div className="w-full">
            <Skeleton count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
