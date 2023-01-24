export function makeEtherscanTransactionURL(
  transactionHash: string,
): `https://etherscan.io/tx/${string}` {
  return `https://etherscan.io/tx/${transactionHash}`;
}
