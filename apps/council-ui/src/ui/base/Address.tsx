import classNames from "classnames";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { formatAddress } from "./formatting/formatAddress";
import { ExternalLinkSVG } from "./svg/ExternalLink";
import { WalletIcon } from "./WalletIcon";

interface AddressProps {
  address: string;
  className?: string;
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
      className={classNames(
        "hover:underline hover:opacity-70 flex items-center",
        className,
      )}
      href={makeEtherscanAddressURL(address)}
      target="_blank"
      rel="noreferrer"
    >
      <WalletIcon
        address={address}
        className="mr-2"
        size={options?.iconSize ?? 16}
      />

      {formatAddress(address)}
      <ExternalLinkSVG size={options?.iconSize ?? 16} />
    </a>
  );
}
