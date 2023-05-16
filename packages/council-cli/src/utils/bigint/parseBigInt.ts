export function parseBigInt(decimalString: string, decimals = 18): bigint {
  const [whole, part = ""] = decimalString.split(".");
  return BigInt(`${whole}${part.padEnd(decimals, "0")}`);
}
