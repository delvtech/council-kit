/**
 * Validate that a string can be represented as a decimal number
 */
export function isNumberString(str: string): boolean {
  return /^\d*\.?\d+?$/.test(str);
}
