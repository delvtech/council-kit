import assertNever from "assert-never";
import { SupportedChainId } from "src/config/council.config";

export function makeEtherscanAddressURL(
  address: string,
  chainId: SupportedChainId,
): string {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/address/${address}`;
    case 5:
      return `https://goerli.etherscan.io/address/${address}`;
    case 31337:
      return `#`;
    default:
      assertNever(chainId);
  }
}
