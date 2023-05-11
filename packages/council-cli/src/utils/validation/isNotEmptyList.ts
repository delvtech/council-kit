/**
 * Validate that a space separated list is not empty and every value is truthy
 */
export function isNotEmptyList(str: string | undefined): boolean {
  const arr = str?.split(" ");
  return !!arr && arr.length > 0 && arr.every(Boolean);
}
