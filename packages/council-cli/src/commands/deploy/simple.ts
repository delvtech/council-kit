import { Address } from "@delvtech/drift";
import { command } from "clide-js";
import colors from "colors";
import signale from "signale";
import { DeployedContractInfo } from "../../deploy/DeploymentJson.js";
import { localChainIds, mine } from "../../lib/viem.js";
import { freshDeployOption } from "../../options/deploy/fresh-deploy.js";
import { DAY_IN_BLOCKS } from "../../utils/constants.js";
import { DeployOptions } from "../deploy.js";
import deployCoreVotingCommand from "./core-voting.js";
import deployLockingVaultCommand from "./locking-vault.js";
import deployMockErc20Command from "./mock-erc20.js";
import deploySimpleProxyCommand from "./simple-proxy.js";
import deployTreasury from "./treasury.js";

const defaults = {
  token: process.env.VOTING_TOKEN_ADDRESS,
  tokenName: process.env.VOTING_TOKEN_NAME || "Mock Voting Token",
  tokenSymbol: process.env.VOTING_TOKEN_SYMBOL || "MVT",
  quorum: process.env.BASE_QUORUM || "1000000",
  minProposalPower: process.env.MIN_PROPOSAL_POWER || "25000",
  lockDuration: process.env.LOCK_DURATION
    ? +process.env.LOCK_DURATION
    : undefined,
  extraVotingBlocks: process.env.EXTRA_VOTING_BLOCKS
    ? +process.env.EXTRA_VOTING_BLOCKS
    : undefined,
  treasury: process.env.TREASURY_ADDRESS,
  staleBlockLag: DAY_IN_BLOCKS * 28n,
};

export default command({
  description:
    "Deploy a simple version of Council which includes 1 CoreVoting contract for general voting with power from a LockingVault deployed behind a SimpleProxy contract. Also deployed will be a Treasury, and if no voting token address is provided, a mock voting token.",

  options: {
    f: freshDeployOption,
    t: {
      alias: ["token"],
      description: "The address of the token used for voting.",
      type: "string",
      customType: "hex",
      default: defaults.token,
      conflicts: ["token-name", "token-symbol"],
    },
    n: {
      alias: ["token-name"],
      description:
        "The name of the mock token to be deployed for voting if no token address is provided.",
      type: "string",
      default: defaults.tokenName,
      conflicts: ["token"],
    },
    s: {
      alias: ["token-symbol"],
      description:
        "The symbol of the mock token to be deployed for voting if no token address is provided.",
      type: "string",
      default: defaults.tokenSymbol,
      conflicts: ["token"],
    },
    q: {
      alias: ["quorum"],
      description:
        "The minimum voting power required for a proposal to pass as a decimal string.",
      type: "string",
      default: defaults.quorum,
      required: true,
    },
    m: {
      alias: ["min-proposal-power"],
      description:
        "The minimum voting power required to create a proposal as a decimal string.",
      type: "string",
      default: defaults.minProposalPower,
      required: true,
    },
    d: {
      alias: ["lock-duration"],
      description:
        "The number of blocks a proposal must wait before it can be executed.",
      type: "number",
      default: defaults.lockDuration,
    },
    b: {
      alias: ["extra-voting-blocks"],
      description:
        "The number of blocks for which a proposal can still be voted on after it's unlocked.",
      type: "number",
      default: defaults.extraVotingBlocks,
    },
    T: {
      alias: ["treasury"],
      description: "The address of the treasury contract.",
      type: "string",
      customType: "hex",
      default: defaults.treasury,
    },
    l: {
      alias: ["stale-block-lag"],
      description:
        "The number of blocks before the delegation history is forgotten. Voting power can't be used on proposals that are older than the stale block lag.",
      type: "number",
      default: Number(defaults.staleBlockLag),
      required: true,
    },
  },

  handler: async ({ data, options, fork, next }) => {
    const { deployer, council, chain, publicClient } = data as DeployOptions;

    const isFreshDeploy = await options.freshDeploy();

    signale.pending("Deploying Council contracts...");

    // =========================================================================
    // 1. Voting Token
    // =========================================================================

    let votingTokenAddress: Address | undefined;

    if (!isFreshDeploy) {
      votingTokenAddress = await options.token({
        prompt: `Enter voting token address ${colors.dim(
          "(leave blank to deploy a mock voting token)",
        )}`,
      });
    }

    // Deploy a mock voting token if no voting token address was provided
    if (!votingTokenAddress) {
      const name = await options.tokenName({
        prompt: "Enter voting token name",
      });

      const symbol = await options.tokenSymbol({
        prompt: "Enter voting token symbol",
      });

      const { address } = (await fork({
        commands: [deployMockErc20Command],
        // FIXME: Known issue with clide-js where optionValues in fork commands
        // have to be set using the keys of the options object.
        optionValues: {
          n: name,
          s: symbol,
        },
      })) as DeployedContractInfo;

      votingTokenAddress = address;
    }

    // =========================================================================
    // 2. CoreVoting
    // =========================================================================

    const quorum = await options.quorum({
      prompt: "Enter default quorum",
    });

    const minProposalPower = await options.minProposalPower({
      prompt: "Enter minimum proposal power",
    });

    const coreVotingDeployInfo = (await fork({
      commands: [deployCoreVotingCommand],
      // FIXME: Known issue with clide-js where optionValues in fork commands
      // have to be set using the keys of the options object.
      optionValues: {
        q: quorum,
        p: minProposalPower,
        v: isFreshDeploy ? [] : undefined,
      },
    })) as DeployedContractInfo;

    const coreVoting = council.coreVoting(coreVotingDeployInfo.address);
    const lockDuration = await options.lockDuration({
      prompt: `Enter proposal lock duration ${colors.dim("in blocks")}`,
    });

    // Set the CoreVoting lock duration if provided
    if (lockDuration) {
      signale.pending(`Setting CoreVoting lock duration to ${lockDuration}...`);

      const hash = await coreVoting.setLockDuration({
        args: {
          blocks: BigInt(lockDuration),
        },
        options: {
          onMined: () => {
            signale.success(
              `Successfully set CoreVoting lock duration to ${lockDuration}`,
            );
          },
        },
      });

      signale.pending(`CoreVoting lock duration tx submitted: ${hash}`);
    }

    const extraVotingBlocks = await options.extraVotingBlocks({
      prompt: `Enter extra voting time ${colors.dim("(in blocks)")}`,
    });

    // Set the CoreVoting extra voting time if provided
    if (extraVotingBlocks) {
      signale.pending(
        `Setting CoreVoting extra voting time to ${extraVotingBlocks}...`,
      );

      const hash = await coreVoting.changeExtraVotingTime({
        args: {
          extraVoteBlocks: BigInt(extraVotingBlocks),
        },
        options: {
          onMined: () => {
            signale.success(
              `Successfully set CoreVoting extra voting time to ${extraVotingBlocks}`,
            );
          },
        },
      });

      signale.pending(`CoreVoting extra voting time tx submitted: ${hash}`);
    }

    // =========================================================================
    // 3. Voting Vaults
    // =========================================================================

    const staleBlockLag = await options.staleBlockLag({
      prompt: "Enter stale block lag",
    });

    if (localChainIds.includes(chain.id)) {
      const currentBlock = await publicClient.getBlockNumber();
      // Calling queryVotePower on a voting vault that has a stale block lag
      // larger than the current block height will result in an error. To avoid
      // this, we we fast forward the block height.
      const blocksToMine = staleBlockLag + 1 - Number(currentBlock);

      if (blocksToMine > 0) {
        signale.pending(
          `Fast forwarding block height by ${blocksToMine} blocks...`,
        );

        const blockNumber = await mine({
          blocks: blocksToMine,
          client: publicClient,
        });

        signale.success(
          `Successfully fast forwarded block height to ${blockNumber}`,
        );
      }
    }

    console.log("!! votingTokenAddress", votingTokenAddress);
    const lockingVaultDeployInfo = (await fork({
      commands: [deployLockingVaultCommand],
      // FIXME: Known issue with clide-js where optionValues in fork commands
      // have to be set using the keys of the options object.
      optionValues: {
        t: votingTokenAddress,
        l: staleBlockLag,
      },
    })) as DeployedContractInfo;

    const lockVaultProxyDeployInfo = (await fork({
      commands: [deploySimpleProxyCommand],
      // FIXME: Known issue with clide-js where optionValues in fork commands
      // have to be set using the keys of the options object.
      optionValues: {
        g: coreVotingDeployInfo.address,
        i: lockingVaultDeployInfo.address,
      },
    })) as DeployedContractInfo;

    // Approve the vault to be used by the CoreVoting contract
    signale.pending("Changing LockingVault SimpleProxy status in CoreVoting");

    const lockingVaultStatusHash = await coreVoting.changeVaultStatus({
      args: {
        vault: lockVaultProxyDeployInfo.address,
        isValid: true,
      },
      options: {
        onMined: () => {
          signale.success(
            "Successfully changed LockingVault SimpleProxy status in CoreVoting",
          );
        },
      },
    });

    signale.pending(
      `LockingVault SimpleProxy status tx submitted: ${lockingVaultStatusHash}`,
    );

    // =========================================================================
    // 4. Treasury
    // =========================================================================

    let treasury: Address | undefined;

    if (!isFreshDeploy) {
      treasury = await options.treasury({
        prompt: `Enter Treasury address ${colors.dim(
          "(leave blank to deploy a new one)",
        )}`,
      });
    }

    if (!treasury) {
      await fork({
        commands: [deployTreasury],
        // FIXME: Known issue with clide-js where optionValues in fork commands
        // have to be set using the keys of the options object.
        optionValues: {
          g: coreVotingDeployInfo.address,
        },
      });
    }

    // =========================================================================
    // DONE!
    // =========================================================================

    next(deployer.deployedContracts);
  },
});
