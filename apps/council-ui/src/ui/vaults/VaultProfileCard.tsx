import Link from "next/link";
import { ReactElement, ReactNode } from "react";
import { makeVaultURL } from "src/routes";
import { WalletIcon } from "src/ui/base/WalletIcon";

interface Stat {
  label: ReactNode;
  value: ReactNode;
}

interface ButtonOptions {
  text: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface VaultProfileCardProps {
  name: ReactNode;
  address: string;
  stats: (Stat | undefined)[];
  button?: ButtonOptions;
}

export function VaultProfileCard({
  name,
  address,
  stats,
  button,
}: VaultProfileCardProps): ReactElement {
  return (
    <div className="flex flex-col p-8 md:max-w-md grow md:grow-0 gap-y-4 justify-between daisy-card bg-base-200 min-w-[360px]">
      <div className="flex flex-col gap-4">
        <Link
          className="flex items-center underline hover:no-underline gap-x-2"
          href={makeVaultURL(address)}
        >
          <WalletIcon address={address} />

          <h3 className="text-2xl font-semibold">{name}</h3>
        </Link>
      </div>

      {stats.map(
        (stat, i) =>
          stat && (
            <div key={i} className="flex items-center w-full">
              <p>{stat.label}</p>
              <p className="ml-auto font-bold">{stat.value}</p>
            </div>
          ),
      )}

      {button && (
        <button
          className="w-full daisy-btn"
          disabled={button.disabled}
          onClick={() => button.onClick()}
        >
          {button.text}
        </button>
      )}
    </div>
  );
}
