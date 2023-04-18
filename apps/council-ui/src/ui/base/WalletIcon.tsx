import jazzicon from "@metamask/jazzicon";
import classNames from "classnames";
import { ReactElement, useEffect, useRef } from "react";

interface WalletIconProps {
  address: string;
  size?: number;
  className?: string;
}

/**
 * A MetaMask style jazzicon
 * @param address - The address of the wallet
 * @param size - The size (diameter) for the icon. Default: 20
 */
export function WalletIcon({
  address,
  size = 20,
  className,
}: WalletIconProps): ReactElement {
  // create a ref to the div's dom node so we can add the icon.
  const jazziconRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // https://github.com/MetaMask/metamask-extension/blob/master/ui/helpers/utils/icon-factory.js#L84
    const seed = parseInt(address.slice(2, 10), 16);
    const icon = jazzicon(size, seed);
    jazziconRef.current?.replaceChildren(icon);
  }, [address, size]);

  return (
    <span
      className={classNames("inline-flex", className)}
      ref={jazziconRef}
    ></span>
  );
}
