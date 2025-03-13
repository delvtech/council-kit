import { Address } from "@delvtech/drift";
import { command } from "clide-js";
import colors from "colors";
import signale from "signale";
import { config } from "../../config.js";
import { DeployedContractInfo } from "../../deploy/DeploymentJson.js";
import { localChainIds, mine } from "../../lib/viem.js";
import { freshDeployOption } from "../../options/fresh-deploy.js";
import { DeployOptions } from "../deploy.js";
import deployCoreVotingCommand from "./core-voting.js";
import deployLockingVaultCommand from "./locking-vault.js";
import deployMockErc20Command from "./mock-erc20.js";
import deploySimpleProxyCommand from "./simple-proxy.js";
import deployTreasury from "./treasury.js";

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
      default: config.get("token"),
      conflicts: ["token-name", "token-symbol"],
    },
    n: {
      alias: ["token-name"],
      description:
        "The name of the mock token to be deployed for voting if no token address is provided.",
      type: "string",
      default: config.get("tokenName"),
      conflicts: ["token"],
    },
    s: {
      alias: ["token-symbol"],
      description:
        "The symbol of the mock token to be deployed for voting if no token address is provided.",
      type: "string",
      default: config.get("tokenSymbol"),
      conflicts: ["token"],
    },
    q: {
      alias: ["quorum"],
      description:
        "The minimum voting power required for a proposal to pass as a decimal string.",
      type: "string",
      default: config.get("quorum"),
      required: true,
    },
    m: {
      alias: ["min-proposal-power"],
      description:
        "The minimum voting power required to create a proposal as a decimal string.",
      type: "string",
      default: config.get("minProposalPower"),
      required: true,
    },
    d: {
      alias: ["lock-duration"],
      description:
        "The number of blocks a proposal must wait before it can be executed.",
      type: "number",
      default: config.get("lockDuration"),
    },
    b: {
      alias: ["extra-voting-blocks"],
      description:
        "The number of blocks for which a proposal can still be voted on after it's unlocked.",
      type: "number",
      default: config.get("extraVotingBlocks"),
    },
    T: {
      alias: ["treasury"],
      description: "The address of the treasury contract.",
      type: "string",
      customType: "hex",
      default: config.get("treasury"),
    },
    l: {
      alias: ["stale-block-lag"],
      description:
        "The number of blocks before the delegation history is forgotten. Voting power can't be used on proposals that are older than the stale block lag.",
      type: "number",
      default: Number(config.get("staleBlockLag")),
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
        optionValues: { name, symbol },
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
      optionValues: {
        quorum,
        minProposalPower,
        vaults: isFreshDeploy ? [] : undefined,
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
      await publicClient.waitForTransactionReceipt({ hash });
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
      await publicClient.waitForTransactionReceipt({ hash });
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
      optionValues: {
        token: votingTokenAddress,
        staleBlockLag,
      },
    })) as DeployedContractInfo;

    const lockVaultProxyDeployInfo = (await fork({
      commands: [deploySimpleProxyCommand],
      optionValues: {
        governance: coreVotingDeployInfo.address,
        implementation: lockingVaultDeployInfo.address,
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
    await publicClient.waitForTransactionReceipt({
      hash: lockingVaultStatusHash,
    });

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
        optionValues: {
          governance: coreVotingDeployInfo.address,
        },
      });
    }

    // =========================================================================
    // DONE!
    // =========================================================================

    next(deployer.deployedContracts);
  },
});
