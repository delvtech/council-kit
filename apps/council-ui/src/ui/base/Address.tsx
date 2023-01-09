import classNames from "classnames";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { formatAddress } from "./formatting/formatAddress";
import { ExternalLinkSVG } from "./svg/ExternalLink";

interface AddressProps {
  address: string;
  className: string;
  options?: {
    iconSize?: number;
  };
}

export function Address({
  address,
  className,
  options,
}: AddressProps): ReactElement {
  return (
    <a
      className={classNames("hover:underline", className)}
      href={makeEtherscanAddressURL(address)}
      target="_blank"
      rel="noreferrer"
    >
      {formatAddress(address)}
      <ExternalLinkSVG size={options?.iconSize ?? 16} />
    </a>
  );
}
