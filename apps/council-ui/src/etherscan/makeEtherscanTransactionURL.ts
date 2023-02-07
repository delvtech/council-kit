import { SupportedChainId } from "src/config/council.config";

export function makeEtherscanTransactionURL(
  transactionHash: string,
  chainId: SupportedChainId,
): string {
  if (chainId === 1) {
    return `https://etherscan.io/tx/${transactionHash}`;
  }
  return `https://goerli.etherscan.io/tx/${transactionHash}`;
}
