import ganache from "ganache";
import signale from "signale";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { createCommandModule } from "src/utils/createCommandModule";

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
        chainId: args.chainId,
      },
      wallet: {
        accounts: [
          {
            secretKey: process.env.WALLET_PRIVATE_KEY,
            balance: BigInt("9000000000000000000000"),
          },
        ],
      },
    });

    server.listen(port, async (err) => {
      if (err) {
        throw err;
      }

      signale.success(
        `Server listening at http://${server.address().address}:${port} 🚀`,
      );
    });
  },
});
