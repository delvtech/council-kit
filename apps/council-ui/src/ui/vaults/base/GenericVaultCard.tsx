import Link from "next/link";
import { ReactElement } from "react";
import { makeVaultURL } from "src/routes";
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
    <div className="daisy-card bg-base-200 shadow-lg md:w-[420px] border border-accent-focus">
      <figure>
        <img src={"/voting-vault-art.webp"} alt="voting vault art" />
      </figure>
      <div className="daisy-card-body">
        <h2 className="daisy-card-title">{name}</h2>

        <div className="daisy-card-actions justify-start">
          <div className="flex flex-row items-start mr-auto gap-x-6">
            {tvp && (
              <div>
                <h2>TVP</h2>
                <p className="font-bold">{formatBalance(tvp)}</p>
              </div>
            )}
            {votingPower && (
              <div>
                <h2>Your TVP</h2>
                <p className="font-bold">{formatBalance(votingPower)}</p>
              </div>
            )}
          </div>
          <Link href={makeVaultURL(address)}>
            <button className=" daisy-btn daisy-btn-primary">Open Vault</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
