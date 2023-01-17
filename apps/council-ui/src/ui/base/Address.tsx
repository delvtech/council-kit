import classNames from "classnames";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/etherscan/makeEtherscanAddressURL";
import { formatAddress } from "./formatting/formatAddress";
import { ExternalLinkSVG } from "./svg/ExternalLink";
import { WalletIcon } from "./WalletIcon";

interface AddressProps {
  address: string;
  className?: string;
  iconSize?: number;
}

export function Address({
  address,
  className,
  iconSize,
}: AddressProps): ReactElement {
  return (
    <a
      className={classNames("hover:underline  flex items-center", className)}
      href={makeEtherscanAddressURL(address)}
      target="_blank"
      rel="noreferrer"
    >
      <WalletIcon address={address} className="mr-2" size={iconSize ?? 16} />

      {formatAddress(address)}
      <ExternalLinkSVG size={iconSize ?? 16} />
    </a>
  );
}
