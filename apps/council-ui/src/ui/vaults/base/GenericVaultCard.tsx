import Link from "next/link";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeVaultURL } from "src/routes";
import { Address } from "src/ui/base/Address";
import { formatBalance } from "src/ui/base/formatting/formatBalance";

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
    <div className="w-full sm:max-w-[300px] daisy-card bg-base-300">
      <div className="daisy-card-body">
        <h2 className="text-2xl daisy-card-title">{name}</h2>
        <Address address={address} className="text-lg" />

        <div className="flex-col daisy-card-actions gap-y-6">
          <div className="flex flex-row items-start mr-auto text-lg gap-x-6">
            <div>
              <h2>TVP</h2>
              <p className="font-bold">{tvp ? formatBalance(tvp) : "None"}</p>
            </div>
            <div>
              <h2>Your TVP</h2>
              <p className="font-bold">
                {votingPower ? formatBalance(votingPower) : "None"}
              </p>
            </div>
          </div>
          <Link href={makeVaultURL(address)}>
            <button className=" daisy-btn daisy-btn-primary">Open</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function GenericVaultCardSkeleton(): ReactElement {
  return (
    <div className="w-full sm:max-w-[300px] daisy-card bg-base-300">
      <div className="daisy-card-body">
        <h2 className="w-32">
          <Skeleton />
          <Skeleton />
        </h2>

        <div className="flex-col daisy-card-actions gap-y-6">
          <div className="flex flex-row items-start mr-auto text-lg gap-x-6">
            <div className="w-24">
              <Skeleton />
              <p className="font-bold">
                <Skeleton />
              </p>
            </div>
            <div className="w-24">
              <Skeleton />
              <p className="font-bold">
                <Skeleton />
              </p>
            </div>
          </div>
          <button className="daisy-btn daisy-btn-disabled daisy-btn-primary">
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
