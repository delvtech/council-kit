import { format } from "d3-format";
import { commify } from "ethers/lib/utils";

/**
 * Used for final balance presentation since it cuts off decimals
 * @param balance
 * @param numDecimals max decimals, default is 1
 * @returns a formatted string with proper commas and {numDecimals} decimal places
 */
export function formatBalance(
  balance: string | number,
  numDecimals = 1,
): string {
  return commify(format(`.${numDecimals}~f`)(+balance));
}
