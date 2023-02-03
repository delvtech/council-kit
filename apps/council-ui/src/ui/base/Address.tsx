import classNames from "classnames";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/etherscan/makeEtherscanAddressURL";
import { formatAddress } from "./formatting/formatAddress";
import { ExternalLinkSVG } from "./svg/ExternalLink";
import { WalletIcon } from "./WalletIcon";

interface AddressProps {
  address: string;
  /**
   * If provided this will be rendered instead of the formatted address or ens.
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
    <a
      className={classNames("hover:underline  flex items-center", className)}
      href={makeEtherscanAddressURL(address)}
      target="_blank"
      rel="noreferrer"
    >
      <WalletIcon address={address} className="mr-1" size={iconSize ?? 16} />

      {label ? label : formatAddress(address)}

      <ExternalLinkSVG size={iconSize ?? 16} />
    </a>
  );
}
