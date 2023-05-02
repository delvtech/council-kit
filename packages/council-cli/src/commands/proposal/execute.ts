import { CouncilContext, Proposal } from "@council/sdk";
import { getDefaultProvider, Wallet } from "ethers";
import prompts from "prompts";
import signale from "signale";
import { config } from "src/config";
import { ArgumentsCamelCase, CommandBuilder } from "yargs";

export const command = "execute";
export const describe = "Execute a proposal";

export const builder: CommandBuilder = (argv) => {
  return argv.options({
    a: {
      alias: ["address"],
      describe: "The voting contract address",
      type: "string",
    },
    p: {
      alias: ["proposal-id"],
      describe: "The id of the proposal to execute",
      type: "number",
    },
    w: {
      alias: ["wallet-key"],
      describe: "The key of the wallet to use for the transaction",
      type: "string",
      hidden: true,
    },
  });
};

export async function handler(
  argv: ArgumentsCamelCase<{
    address?: string;
    proposalId?: number;
    walletKey?: string;
  }>,
): Promise<void> {
  let address = argv.address;
  let proposalId = argv.proposalId;
  let walletKey = argv.walletKey || process.env.WALLET_PRIVATE_KEY;

  if (!address) {
    const promptResult = await prompts({
      type: "text",
      name: "address",
      message: "Enter voting contract address",
    });
    address = promptResult.address;
  }

  if (proposalId === undefined) {
    const promptResult = await prompts({
      type: "number",
      name: "proposalId",
      message: "Enter proposal id",
    });
    proposalId = promptResult.proposalId;
  }

  if (!walletKey) {
    const promptResult = await prompts({
      type: "text",
      name: "walletKey",
      message: "Enter wallet key",
    });
    walletKey = promptResult.walletKey;
  }

  const rpcURL = config.get("rpc-url");
  const provider = getDefaultProvider(rpcURL);
  const signer = new Wallet(walletKey!, provider);

  const context = new CouncilContext(provider);
  const proposal = new Proposal(proposalId!, address!, context);

  try {
    signale.success(await proposal.execute(signer));
  } catch (err) {
    signale.error(err);
  }
}
