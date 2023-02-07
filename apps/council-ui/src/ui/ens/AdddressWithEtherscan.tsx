import classNames from "classnames";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/etherscan/makeEtherscanAddressURL";
import { Address } from "src/ui/base/Address";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import { useChainId } from "src/ui/network/useChainId";

interface AddressWithEtherscanProps {
  address: string;
  /**
   * If provided this will be rendered instead of the formatted address or ens.
   */
  label?: string;
  className?: string;
  iconSize?: number;
}

export function AddressWithEtherscan({
  address,
  className,
  label,
  iconSize,
}: AddressWithEtherscanProps): ReactElement {
  const chainId = useChainId();
  return (
    <a
      className={classNames("hover:underline  flex items-center", className)}
      href={makeEtherscanAddressURL(address, chainId)}
      target="_blank"
      rel="noreferrer"
    >
      <Address address={address} label={label} iconSize={iconSize} />
      <ExternalLinkSVG size={iconSize ?? 16} />
    </a>
  );
}
