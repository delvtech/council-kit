export function makeGoerliTransactionUrl(txHash: string): string {
  return `https://goerli.etherscan.io/tx/${txHash}`;
}
