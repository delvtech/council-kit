import signale from "signale";
import { Argv } from "yargs";

export const command = "foo";

export const describe = "Do foo";

export function handler(argv: Argv): void {
  signale.success("Foo!");
}
