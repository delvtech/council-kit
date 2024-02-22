import classNames from "classnames";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { WalletIcon } from "src/ui/base/WalletIcon";

interface AddressProps {
  address: `0x${string}`;
  /**
   * If provided this will be rendered instead of the formatted address.
   */
  label?: string;
  className?: string;
  iconSize?: number;
}

export function Address({
  address,
  className,
  label,
  iconSize,
}: AddressProps): ReactElement {
  return (
    <span className={classNames("flex items-center", className)}>
      <WalletIcon address={address} className="mr-1" size={iconSize ?? 16} />
      {label ? label : formatAddress(address)}
    </span>
  );
}
