import { SupportedChainId } from "src/config/council.config";

export function makeEtherscanAddressURL(
  address: string,
  chainId: SupportedChainId,
): string {
  if (chainId === 1) {
    return `https://etherscan.io/address/${address}`;
  }
  return `https://goerli.etherscan.io/address/${address}`;
}
