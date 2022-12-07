import fs from "fs";
export function writeFile<T>(outputPath: string, data: T): void {
  const fileString = JSON.stringify(data, null, 2);
  fs.writeFileSync(outputPath, fileString);
}
