import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { formatUnits } from "viem";

/**
 * Formats a balance with a fixed number of decimals
 * @param balance The balance to format
 * @param decimals The number of decimals in the balance to format. Defaults to
 * 18.
 * @param displayDecimals The number of decimals to display. Defaults to 1.
 * @returns The formatted balance
 */
export function formatUnitsBalance({
  balance,
  decimals = 18,
  displayDecimals = 1,
}: {
  balance: number | bigint;
  decimals?: number;
  displayDecimals?: number;
}): `${number}` {
  const formatted = formatUnits(BigInt(balance), decimals);
  return formatBalance(formatted, displayDecimals);
}
