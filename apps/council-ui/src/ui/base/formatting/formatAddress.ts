export function formatAddress(address: string): string {
  // first 2 and last 4 to match rainbowkit's style
  return `0x${address.slice(2, 4)}...${address.slice(-4)}`;
}
