export function formatBigInt(bigInt: bigint, decimals = 18): string {
  const bigIntString = bigInt.toString();
  const whole = bigIntString.slice(0, -decimals);
  const part = bigIntString.padStart(decimals, "0").slice(-decimals);
  return `${whole || 0}${part && `.${part}`}`;
}
