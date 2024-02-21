import classNames from "classnames";
import { ReactElement } from "react";
import { Address } from "src/ui/base/Address";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { makeEtherscanAddressURL } from "src/utils/etherscan/makeEtherscanAddressURL";

interface AddressWithEtherscanProps {
  address: `0x${string}`;
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
  const chainId = useSupportedChainId();
  return (
    <a
      className={classNames("flex  items-center hover:underline", className)}
      href={makeEtherscanAddressURL(address, chainId)}
      target="_blank"
      rel="noreferrer"
    >
      <Address address={address} label={label} iconSize={iconSize} />
      <ExternalLinkSVG size={iconSize ?? 16} />
    </a>
  );
}
