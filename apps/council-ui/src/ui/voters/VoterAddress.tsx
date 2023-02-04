import { BuildingLibraryIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { Tooltip } from "src/ui/base/Tooltip/Tooltip";
import { WalletIcon } from "src/ui/base/WalletIcon";

interface VoterAddressProps {
  address: string;
  ensName?: string | null;
  isGSCMember?: boolean;
  isDelegate?: boolean;
  /**
   * If provided this will be rendered instead of the formatted address or ens.
   */
  label?: string;
  className?: string;
  iconSize?: number;
}

export function VoterAddress({
  address,
  ensName,
  className,
  isGSCMember,
  isDelegate,
  iconSize,
}: VoterAddressProps): ReactElement {
  return (
    <span className={`flex items-center ${className}`}>
      <WalletIcon size={iconSize} address={address} className="mr-2" />
      {ensName ? ensName : formatAddress(address)}
      {isGSCMember && (
        <Tooltip content="GSC Member">
          <BuildingLibraryIcon className="w-5 h-5 ml-1 fill-warning" />
        </Tooltip>
      )}
      {isDelegate && (
        <Tooltip content="Current Delegate">
          <UserCircleIcon className="w-5 h-5 ml-1 fill-accent" />
        </Tooltip>
      )}
    </span>
  );
}
