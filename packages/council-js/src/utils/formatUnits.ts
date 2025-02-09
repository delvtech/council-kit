import Big from "big.js";

export function formatUnits(value: number | bigint, decimals: number): string {
  return Big(String(value)).div(Big(10).pow(decimals)).toFixed(decimals);
}
