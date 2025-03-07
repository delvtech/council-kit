import { readdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Get the path to the nearest app root directory based on the presence of a
 * `package.json` file.
 * @param currentDirectory - The directory to start searching from. Defaults to
 * the current working directory.
 */
export function getAppRootDir(
  rootDir = "/",
  currentDirectory = process.cwd(),
): string {
  if (currentDirectory === rootDir) {
    throw new Error("Could not find an app root directory.");
  }
  const dirItems = readdirSync(currentDirectory);
  if (!dirItems.includes("package.json")) {
    const parentDir = dirname(currentDirectory);
    return getAppRootDir(parentDir);
  }
  return currentDirectory;
}
