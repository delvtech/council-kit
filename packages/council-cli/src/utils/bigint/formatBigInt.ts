export function formatBigInt(bigInt: bigint, decimals = 18): string {
  const bigIntString = bigInt.toString();
  const whole = bigIntString.slice(0, bigIntString.length - decimals);
  const part = bigIntString.slice(-decimals).replace(/0*$/, "");
  return `${whole || 0}${part && `.${part}`}`;
}
