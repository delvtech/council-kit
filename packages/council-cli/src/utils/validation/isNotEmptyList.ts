/**
 * Validate that a list is not empty and every value is truthy
 */
export function isNotEmptyList(arr: any[] | undefined): arr is any[] {
  return !!arr && arr.length > 0 && arr.every(Boolean);
}
