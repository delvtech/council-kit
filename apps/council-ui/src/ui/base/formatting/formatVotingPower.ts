import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { formatUnits } from "viem";

/**
 * Formats a scaled voting power for display.
 */
export function formatVotingPower(
  balance: number | bigint,
  displayDecimals: number = 1,
): `${number}` {
  // Always use 18 decimals for voting power
  const formatted = formatUnits(BigInt(balance), 18);
  return formatBalance(formatted, displayDecimals);
}
