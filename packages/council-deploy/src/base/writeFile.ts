import fs from "fs";
export function writeFile<T>(file: T, outputPath: string): void {
  const fileString = JSON.stringify(file, null, 2);
  fs.writeFileSync(outputPath, fileString);
}
