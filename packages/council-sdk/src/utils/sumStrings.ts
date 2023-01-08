import { formatEther, parseEther } from "ethers/lib/utils";
import type { ethers } from "ethers";

/**
 * Takes a group of numbers represented as strings and sums them together using
 * `ethers.BigNumber`.
 * @see https://docs.ethers.org/v5/api/utils/bignumber
 * @category Utils
 */
export function sumStrings(numberStrings: string[]): string {
  if (!numberStrings.length) {
    return "0";
  }

  let total = parseEther(numberStrings[0]);
  for (const bnString of numberStrings.slice(1)) {
    total = total.add(parseEther(bnString));
  }
  return formatEther(total);
}
