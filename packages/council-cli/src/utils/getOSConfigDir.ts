import os from "node:os";
import path from "node:path";

/**
 * Get the path to an app specific config directory based on operating system
 * standards.
 * @param projectName
 * @returns
 */
export function getOSConfigDir(projectName: string): string {
  const homeDir = os.homedir();
  const platform = os.platform();

  let configDir: string;

  if (platform === "win32") {
    // Windows
    // https://learn.microsoft.com/en-us/windows/apps/design/app-settings/store-and-retrieve-app-data
    // https://learn.microsoft.com/en-us/windows/uwp/get-started/fileio-learning-track#app-folders
    // https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-recognized-environment-variables#variables-that-are-recognized-only-in-the-user-context
    /* eslint-disable-next-line turbo/no-undeclared-env-vars */
    configDir = process.env.APPDATA || path.join(homeDir, "AppData", "Roaming");
  } else if (platform === "darwin") {
    // macOS
    // https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/MacOSXDirectories/MacOSXDirectories.html
    // https://apple.fandom.com/wiki/Preferences_folder
    configDir = path.join(homeDir, "Library", "Preferences");
  } else {
    // Linux and others
    // https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
    // https://how-to.fandom.com/wiki/Guide_to_linux_configuration_files
    /* eslint-disable-next-line turbo/no-undeclared-env-vars */
    configDir = process.env.XDG_CONFIG_HOME || path.join(homeDir, ".config");
  }

  // `-nodejs` suffix used to reduce likelihood of conflicts.
  return path.join(configDir, `${projectName}-nodejs`);
}
