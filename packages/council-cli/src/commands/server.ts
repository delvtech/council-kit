// HACK: Suppress ganache warning about bigint
// https://github.com/trufflesuite/ganache/issues/1080#issuecomment-906550239
const originalConsoleWarn = console.warn;
console.warn = () => {};

import colors from "colors";
import ganache from "ganache";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { formatBigInt } from "src/utils/bigint/formatBigInt";
import { createCommandModule } from "src/utils/createCommandModule";

console.warn = originalConsoleWarn;

export const { command, describe, builder, handler } = createCommandModule({
  command: "server [OPTIONS]",
  describe: "Start a local ethereum node",

  builder: (argv) => {
    return argv.options({
      p: {
        alias: ["port"],
        describe: "The port to listen on",
        type: "number",
        default: 8545,
      },
      h: {
        alias: ["host"],
        describe: "The hostname to listen on",
        type: "string",
        default: "127.0.0.1",
      },
      b: {
        alias: ["balance"],
        describe: "The ETH balance to assign to each account",
        type: "number",
        default: 100,
      },
      t: {
        alias: ["block-time"],
        describe: "The blockTime in seconds for automatic mining",
        type: "number",
      },
      c: {
        alias: ["chain-id"],
        describe: "The id to use for the local blockchain",
        type: "number",
        default: 31337,
      },
    });
  },

  handler: async (args) => {
    const port = await requiredNumber(args.port, {
      name: "port",
      message: "Enter port number",
      initial: 8545,
    });

    const server = ganache.server({
      blockTime: args.blockTime,
      chain: {
        chainId: args.chainId || 31337,
      },

      wallet: {
        totalAccounts: 10,
        defaultBalance: args.balance,
      },
    });

    server.listen(port, args.host, async (err) => {
      if (err) {
        throw err;
      }

      console.log("\n");
      signale.success(
        `Server listening at http://${server.address().address}:${port} 🚀`,
      );

      const initialAccounts = await server.provider.getInitialAccounts();

      console.log("\n");
      console.log(`Initial Accounts:`);
      console.log(colors.dim(`${"=".repeat(80)}`));

      Object.entries(initialAccounts).forEach(([address, account], i) => {
        const balance = formatBigInt(account.balance);
        console.log(`Account ${i + 1}: ${address} (${balance} ETH)`);
        console.log(`Private Key: ${account.secretKey}`);
        console.log(colors.dim(`${"-".repeat(80)}`));
      });
    });
  },
});
