import { command } from "clide-js";
import colors from "colors";
import { Deployer } from "../deploy/Deployer.js";
import {
  getWriteOptions,
  WriteOptions,
  writeOptions,
} from "../options/writeOptions.js";

const line = colors.dim("-".repeat(80));
const thickLine = colors.dim("=".repeat(80));

export default command({
  description: "Deploy a contract or combination of contracts.",
  requiresSubcommand: true,

  options: {
    name: {
      description:
        "A name for the deployment. Defaults to the the contract name if a single contract is deployed, otherwise a timestamp.",
      type: "string",
    },
    "out-dir": {
      alias: ["deployments-dir"],
      description:
        "The directory to write the contract deployment information to, relative to the current working directory. Defaults to process.env.DEPLOYMENTS_DIR.",
      type: "string",
      default: process.env.DEPLOYMENTS_DIR,
    },
    ...writeOptions,
  },

  handler: async ({ options, client, next, commands }) => {
    const { walletClient, publicClient, ...rest } = await getWriteOptions(
      options,
      client,
    );

    const deployer = new Deployer({ publicClient, walletClient });

    const deployOptions: DeployOptions = {
      deployer,
      publicClient,
      walletClient,
      ...rest,
    };

    await next(deployOptions);

    const outDir = await options.outDir();
    let name = await options.name();

    if (!name) {
      if (deployer.deployedContracts.length === 1) {
        name = deployer.deployedContracts[0].name;
      } else {
        const lastCommandName = commands.at(-1)?.commandName;
        name = lastCommandName || new Date().toISOString().replace(/:/g, "-");
      }
    }

    await deployer.save({ name, outDir });

    console.log(`
Deployment complete!

${thickLine}
${deployer.deployedContracts
  .map(({ name, address }, i) => {
    if (i !== 0) {
      return `${line}\n${name}: ${address}`;
    }
    return `${name}: ${address}`;
  })
  .join("\n")}
${thickLine}
`);
  },
});

export interface DeployOptions extends WriteOptions {
  deployer: Deployer;
}
