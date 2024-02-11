import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { formatUnits } from "viem";

/**
 * Formats a balance with a fixed number of decimals
 */
export function formatUnitsBalance({
  balance,
  decimals,
  displayDecimals,
}: {
  balance: number | bigint;
  decimals: number;
  displayDecimals?: number;
}): `${number}` {
  const formatted = formatUnits(BigInt(balance), decimals);
  return formatBalance(formatted, displayDecimals);
}
