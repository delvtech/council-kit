import { Ballot, CouncilContext, VotingContract } from "@council/sdk";
import { getDefaultProvider, Wallet } from "ethers";
import signale from "signale";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredArray } from "src/options/utils/requiredArray";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredOption } from "src/options/utils/requiredOption";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { DAY_IN_BLOCKS } from "src/utils/constants";
import { createCommandModule } from "src/utils/createCommandModule";

export const { command, describe, builder, handler } = createCommandModule({
  command: "create [OPTIONS]",
  describe: "Create a proposal",

  builder: (yargs) => {
    return yargs.options({
      a: {
        alias: ["address"],
        describe: "The voting contract address",
        type: "string",
      },
      v: {
        alias: ["vaults"],
        describe:
          "The addresses of the approved voting vaults to draw voting power from. This will be used to verify that the signer has enough voting power to create a proposal.",
        type: "array",
        string: true,
      },
      t: {
        alias: ["targets"],
        describe: "A list of addresses to call.",
        type: "array",
        string: true,
      },
      d: {
        alias: ["calldatas"],
        describe: "Encoded call data for each target.",
        type: "array",
        string: true,
      },
      l: {
        alias: ["last-call"],
        describe:
          "The block after which the proposal can no longer be executed.",
        type: "number",
      },
      b: {
        alias: ["ballot"],
        describe: "The initial vote from the signer's account",
        type: "string",
        choices: ["yes", "no", "maybe"],
        default: "yes",
      },
      w: walletKeyOption,
      r: rpcUrlOption,
    });
  },

  handler: async (args) => {
    const address = await requiredString(args.address, {
      name: "address",
      message: "Enter voting contract address",
    });

    const vaults = await requiredArray(args.vaults, {
      name: "targets",
      message: "Enter voting vault addresses",
    });

    const targets = await requiredArray(args.targets, {
      name: "targets",
      message: "Enter target addresses",
    });

    const calldatas = await requiredArray(args.calldatas, {
      name: "calldatas",
      message: "Enter call data for each target",
    });

    const ballot = await requiredOption(args.ballot, {
      name: "ballot",
      message: "Select initial ballot",
      type: "select",
      choices: [
        {
          title: "Yes",
          value: "yes",
        },
        {
          title: "No",
          value: "no",
        },
        {
          title: "Abstain",
          value: "maybe",
        },
      ],
    });

    const walletKey = await requiredWalletKey(args.walletKey);
    const rpcURL = await requiredRpcUrl(args.rpcUrl);

    const provider = getDefaultProvider(rpcURL);
    const context = new CouncilContext(provider);
    const votingContract = new VotingContract(address, [], context);

    const signer = new Wallet(walletKey, provider);
    const currentBlock = await provider.getBlockNumber();

    const lastCall = await requiredNumber(args.lastCall, {
      name: "last-call",
      message: "Enter the last call block",
      initial: currentBlock + DAY_IN_BLOCKS * 90,
    });

    signale.success(
      await votingContract.createProposal(
        signer,
        vaults,
        targets,
        calldatas,
        lastCall,
        ballot as Ballot,
      ),
    );
  },
});
