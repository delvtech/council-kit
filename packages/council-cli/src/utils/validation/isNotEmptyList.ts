/**
 * Validate that a list is not empty and every value is truthy
 */
export function isNotEmptyList(arr: any[] | undefined): boolean {
  return !!arr && arr.length > 0 && arr.every(Boolean);
}
