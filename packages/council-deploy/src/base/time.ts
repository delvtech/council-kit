/**
 * Simple util for waiting some amount of time. Useful for dealing with rate
 * limits.
 *
 * Example:
 * async function foo() {
 *   await delay(5000);
 *   console.log("Waited 5s");
 * }
 */
export function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
