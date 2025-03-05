import assertNever from "assert-never";
import { SupportedChainId } from "src/config/council.config";

export function makeEtherscanTransactionURL(
  transactionHash: string,
  chainId: SupportedChainId,
): string {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/tx/${transactionHash}`;
    case 5:
      return `https://goerli.etherscan.io/tx/${transactionHash}`;
    case 31337:
      return `#`;
    default:
      assertNever(chainId);
  }
}
