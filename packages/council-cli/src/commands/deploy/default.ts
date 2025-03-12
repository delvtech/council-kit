import { Timelock } from "@delvtech/council-artifacts/Timelock";
import { command } from "clide-js";
import colors from "colors";
import signale from "signale";
import { Address } from "viem";
import { DeployedContractInfo } from "../../deploy/DeploymentJson.js";
import { localChainIds, mine } from "../../lib/viem.js";
import { freshDeployOption } from "../../options/deploy/fresh-deploy.js";
import { DAY_IN_BLOCKS, DAY_IN_SECONDS } from "../../utils/constants.js";
import { DeployOptions } from "../deploy.js";
import deployCoreVotingCommand from "./core-voting.js";
import deployGscVaultCommand from "./gsc-vault.js";
import deployLockingVaultCommand from "./locking-vault.js";
import deployMockErc20Command from "./mock-erc20.js";
import deploySimpleProxyCommand from "./simple-proxy.js";
import deployTimelockCommand from "./timelock.js";
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
  timelockWaitTime: process.env.TIMELOCK_WAIT_TIME
    ? +process.env.TIMELOCK_WAIT_TIME
    : DAY_IN_SECONDS * 3n,
  treasury: process.env.TREASURY_ADDRESS,
  staleBlockLag: DAY_IN_BLOCKS * 28n,
  gscQuorum: process.env.GSC_QUORUM || "3",
  gscLockDuration: process.env.GSC_LOCK_DURATION
    ? +process.env.GSC_LOCK_DURATION
    : undefined,
  gscExtraVotingBlocks: process.env.GSC_EXTRA_VOTING_BLOCKS
    ? +process.env.GSC_EXTRA_VOTING_BLOCKS
    : undefined,
  gscVotingPowerBound: process.env.GSC_VOTING_POWER_BOUND || "100000",
  gscIdleDuration: process.env.GSC_IDLE_DURATION
    ? +process.env.GSC_IDLE_DURATION
    : undefined,
};

export default command({
  description:
    "Deploy a default version of Council which includes 2 CoreVoting contracts - 1 for general voting with power from a LockingVault deployed behind a SimpleProxy contract, and another for GSC voting with membership in a GSCVault. Also deployed will be a Timelock, Treasury, and if no voting token address is provided, a mock voting token.",

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
    "timelock-wait-time": {
      description:
        "The amount of time (in seconds) a proposal must wait in the timelock before it can be executed.",
      type: "number",
      default: Number(defaults.timelockWaitTime),
      required: true,
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
    "gsc-quorum": {
      description:
        "The minimum voting power required for a GSC proposal to pass as a decimal string.",
      type: "string",
      default: defaults.gscQuorum,
      required: true,
    },
    "gsc-lock-duration": {
      description:
        "The number of blocks a GSC proposal must wait before it can be executed.",
      type: "number",
      default: defaults.gscLockDuration,
    },
    "gsc-extra-voting-blocks": {
      description:
        "The number of blocks for which a GSC proposal can still be voted on after it's unlocked.",
      type: "number",
      default: defaults.gscExtraVotingBlocks,
    },
    "gsc-voting-power-bound": {
      description:
        "The minimum voting power required to become a member of the GSC as a decimal string.",
      type: "string",
      default: defaults.gscVotingPowerBound,
      required: true,
    },
    "gsc-idle-duration": {
      description:
        "The amount of time (in seconds) a new GSC member must wait after joining before they can vote.",
      type: "number",
      default: defaults.gscIdleDuration,
    },
  },

  handler: async ({ data, options, fork, next }) => {
    const { account, deployer, council, chain, publicClient } =
      data as DeployOptions;

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
    // 2. GSC CoreVoting
    // =========================================================================

    const gscQuorum = await options.gscQuorum({
      prompt: "Enter default GSC quorum",
    });

    const gscCoreVotingDeployInfo = (await fork({
      commands: [deployCoreVotingCommand],
      // FIXME: Known issue with clide-js where optionValues in fork commands
      // have to be set using the keys of the options object.
      optionValues: {
        t: account.address,
        q: gscQuorum,
        p: "1",
      },
    })) as DeployedContractInfo;

    const gscCoreVoting = council.coreVoting(gscCoreVotingDeployInfo.address);
    const gscLockDuration = await options.gscLockDuration();

    // Set the GSC CoreVoting lock duration if provided
    if (gscLockDuration) {
      signale.pending(
        `Setting GSC CoreVoting lock duration to ${gscLockDuration}...`,
      );

      const hash = await gscCoreVoting.setLockDuration({
        args: {
          blocks: BigInt(gscLockDuration),
        },
        options: {
          onMined: () => {
            signale.success(
              `Successfully set GSC CoreVoting lock duration to ${gscLockDuration}`,
            );
          },
        },
      });

      signale.pending(`GSC CoreVoting lock duration tx submitted: ${hash}`);
    }

    const gscExtraVotingBlocks = await options.gscExtraVotingBlocks();

    // Set the GSC CoreVoting extra voting time if provided
    if (gscExtraVotingBlocks) {
      signale.pending(
        `Setting GSC CoreVoting extra voting time to ${gscExtraVotingBlocks}...`,
      );

      const hash = await gscCoreVoting.changeExtraVotingTime({
        args: {
          extraVoteBlocks: BigInt(gscExtraVotingBlocks),
        },
        options: {
          onMined: () => {
            signale.success(
              `Successfully set GSC CoreVoting extra voting time to ${gscExtraVotingBlocks}`,
            );
          },
        },
      });

      signale.pending(`GSC CoreVoting extra voting time tx submitted: ${hash}`);
    }

    // =========================================================================
    // 3. Timelock
    // =========================================================================

    const timelockWaitTime = await options.timelockWaitTime({
      prompt: `Enter timelock wait time ${colors.dim("(in seconds)")}`,
    });

    const timelockDeployInfo = (await fork({
      commands: [deployTimelockCommand],
      // FIXME: Known issue with clide-js where optionValues in fork commands
      // have to be set using the keys of the options object.
      optionValues: {
        t: timelockWaitTime,
        gsc: gscCoreVotingDeployInfo.address,
      },
    })) as DeployedContractInfo;

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
          g: timelockDeployInfo.address,
        },
      });
    }

    // =========================================================================
    // 5. Voting Vaults
    // =========================================================================

    const staleBlockLag = await options.staleBlockLag({
      prompt: "Enter stale block lag",
    });

    if (localChainIds.includes(chain.id)) {
      // Calling queryVotePower on a voting vault that has a stale block lag
      // larger than the current block height will result in an error. To avoid
      // this, we we fast forward the block height.
      const blocksToMine = staleBlockLag + 1;

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
        g: timelockDeployInfo.address,
        i: lockingVaultDeployInfo.address,
      },
    })) as DeployedContractInfo;

    // =========================================================================
    // 6. CoreVoting
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
        g: gscCoreVotingDeployInfo.address,
        v: [lockVaultProxyDeployInfo.address],
      },
    })) as DeployedContractInfo;

    const coreVoting = council.coreVoting(coreVotingDeployInfo.address);
    const lockDuration = await options.lockDuration();

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

    const extraVotingBlocks = await options.extraVotingBlocks();

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
    // 6. GSCVault
    // =========================================================================

    const gscVotingPowerBound = await options.gscVotingPowerBound({
      prompt: "Enter GSC voting power bound",
    });

    const gscVaultDeployInfo = (await fork({
      commands: [deployGscVaultCommand],
      // FIXME: Known issue with clide-js where optionValues in fork commands
      // have to be set using the keys of the options object.
      optionValues: {
        c: coreVotingDeployInfo.address,
        b: gscVotingPowerBound,
        o: timelockDeployInfo.address,
      },
    })) as DeployedContractInfo;

    const gscIdleDuration = await options.gscIdleDuration();

    // Set the GSCVault idle duration if provided
    if (gscIdleDuration) {
      signale.pending(
        `Setting GSCVault idle duration to ${gscIdleDuration}...`,
      );

      const gscVault = council.gscVault(gscCoreVotingDeployInfo.address);
      const hash = await gscVault.setIdleDuration({
        args: {
          duration: BigInt(gscIdleDuration),
        },
        options: {
          onMined: () => {
            signale.success(
              `Successfully set GSCVault idle duration to ${gscIdleDuration}`,
            );
          },
        },
      });

      signale.pending(`GSCVault idle duration tx submitted: ${hash}`);
    }

    // Approve the GSCVault to be used by the GSC CoreVoting contract
    signale.pending("Changing GSCVault status in GSC CoreVoting...");

    const gscVaultStatusHash = await gscCoreVoting.changeVaultStatus({
      args: {
        vault: gscVaultDeployInfo.address,
        isValid: true,
      },
      options: {
        onMined: () => {
          signale.success(
            "Successfully changed GSCVault status in GSC CoreVoting",
          );
        },
      },
    });

    signale.pending(`GSCVault status tx submitted: ${gscVaultStatusHash}`);

    // =========================================================================
    // 7. Lock it down
    // =========================================================================

    signale.pending("Setting GSC CoreVoting owner to Timelock...");

    const gscCoreVotingOwnerHash = await gscCoreVoting.contract.write(
      "setOwner",
      {
        who: timelockDeployInfo.address,
      },
      {
        onMined: () => {
          signale.success("Successfully set GSC CoreVoting owner to Timelock");
        },
      },
    );

    signale.pending(
      `GSC CoreVoting owner tx submitted: ${gscCoreVotingOwnerHash}`,
    );

    signale.pending("Setting CoreVoting owner to Timelock...");

    const coreVotingOwnerHash = await coreVoting.contract.write(
      "setOwner",
      {
        who: timelockDeployInfo.address,
      },
      {
        onMined: () => {
          signale.success("Successfully set CoreVoting owner to Timelock");
        },
      },
    );

    signale.pending(`CoreVoting owner tx submitted: ${coreVotingOwnerHash}`);
    signale.pending("Setting Timelock owner to CoreVoting...");

    const timelockOwnerHash = await council.drift.write({
      abi: Timelock.abi,
      address: "0x",
      fn: "setOwner",
      args: {
        who: timelockDeployInfo.address,
      },
      onMined: () => {
        signale.success("Successfully set Timelock owner to CoreVoting");
      },
    });

    signale.pending(`Timelock owner tx submitted: ${timelockOwnerHash}`);

    // =========================================================================
    // DONE!
    // =========================================================================

    next(deployer.deployedContracts);
  },
});
