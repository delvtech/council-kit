import { type ethers, BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

/**
 * Takes a group of numbers represented as strings and sums them together using
 * {@linkcode ethers.BigNumber}.
 * @param numberStrings - The number strings to sum together
 * @param decimals - The decimal precision to use
 */
export function sumStrings(numberStrings: string[], decimals = 18): string {
  let total = BigNumber.from(0);
  for (const bnString of numberStrings) {
    total = total.add(parseUnits(bnString, decimals));
  }
  return formatUnits(total, decimals);
}
