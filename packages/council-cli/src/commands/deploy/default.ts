import { CoreVoting } from "@council/artifacts/CoreVoting";
import { Timelock } from "@council/artifacts/Timelock";
import { ReadWriteCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import colors from "colors";
import signale from "signale";
import { Address, createPublicClient, createWalletClient, http } from "viem";
import {
  ContractInfo,
  DEFAULT_DEPLOYMENTS_DIR,
  getDeploymentStore,
} from "../../deploymentStore.js";
import { WriteOptions } from "../../reusable-options/writeOptions.js";
import { DAY_IN_BLOCKS, DAY_IN_SECONDS } from "../../utils/constants.js";
import { DeployedContract } from "../../utils/deployContract.js";
import { stringifyBigInts } from "../../utils/stringifyBigInts.js";
import { mine } from "../../viem/utils/mine.js";
import deployCoreVotingCommand from "./core-voting.js";
import deployGscVaultCommand from "./gsc-vault.js";
import deployLockingVaultCommand from "./locking-vault.js";
import deployMockErc20Command from "./mock-erc20.js";
import deploySimpleProxyCommand from "./simple-proxy.js";
import deployTimelockCommand from "./timelock.js";
import deployTreasuryCommand from "./treasury.js";

const defaults = {
  tokenAddress: process.env.VOTING_TOKEN_ADDRESS,
  tokenName: process.env.VOTING_TOKEN_NAME || "Mock Voting Token",
  tokenSymbol: process.env.VOTING_TOKEN_SYMBOL || "MVT",
  baseQuorum: process.env.BASE_QUORUM || "1000000",
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
  treasuryAddress: process.env.TREASURY_ADDRESS,
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
  outDir: DEFAULT_DEPLOYMENTS_DIR,
  name: "default",
};

export default command({
  description:
    "Deploy a default version of Council which includes 2 CoreVoting contracts - 1 for general voting with power from a LockingVault deployed behind a SimpleProxy contract, and another for GSC voting with membership in a GSCVault. Also deployed will be a Timelock, Treasury, and if no voting token address is provided, a mock voting token.",

  options: {
    "token-address": {
      description: "The address of the token used for voting.",
      type: "string",
      default: defaults.tokenAddress,
    },
    "token-name": {
      description:
        "The name of the mock token to be deployed for voting if no token address is provided.",
      type: "string",
      default: defaults.tokenName,
    },
    "token-symbol": {
      description:
        "The symbol of the mock token to be deployed for voting if no token address is provided.",
      type: "string",
      default: defaults.tokenSymbol,
    },
    "base-quorum": {
      description:
        "The minimum voting power required for a proposal to pass. Will be scaled by 10 ** token.decimals.",
      type: "string",
      default: defaults.baseQuorum,
      required: true,
    },
    "min-proposal-power": {
      description:
        "The minimum voting power required to create a proposal. Will be scaled by 10 ** token.decimals.",
      type: "string",
      default: defaults.minProposalPower,
      required: true,
    },
    "lock-duration": {
      description:
        "The number of blocks a proposal must wait before it can be executed.",
      type: "number",
      default: defaults.lockDuration,
    },
    "extra-voting-blocks": {
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
    "treasury-address": {
      description: "The address of the treasury contract.",
      type: "string",
      default: defaults.treasuryAddress,
    },
    "stale-block-lag": {
      description:
        "The number of blocks before the delegation history is forgotten. Voting power can't be used on proposals that are older than the stale block lag.",
      type: "number",
      default: Number(defaults.staleBlockLag),
      required: true,
    },
    "gsc-quorum": {
      description:
        "The minimum voting power required for a GSC proposal to pass.",
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
        "The minimum voting power required to become a member of the GSC. Will be scaled by 10 ** token.decimals.",
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
    out: {
      alias: ["out-dir"],
      description:
        "The directory to write the contract addresses to; relative to the current working directory.",
      type: "string",
      default: defaults.outDir,
    },
    name: {
      description: "The name of the deployment.",
      type: "string",
      default: defaults.name,
    },
  },

  handler: async ({ data, options, fork, next }) => {
    const { account, chain, rpcUrl } = data as WriteOptions;

    const publicClient = createPublicClient({
      transport: http(rpcUrl),
      chain,
    });
    const walletClient = createWalletClient({
      account,
      transport: http(rpcUrl),
      chain,
    });
    const council = new ReadWriteCouncil({ publicClient, walletClient });

    const contractInfos: ContractInfo[] = [];

    signale.pending("Deploying Council contracts...");

    // =========================================================================
    // 1. Voting Token
    // =========================================================================

    let votingTokenAddress = await options.tokenAddress({
      prompt: `Enter voting token address ${colors.dim(
        "(leave blank to deploy a mock voting token)",
      )}`,
    });

    // Used to scale voting power to match the token's decimals
    let decimals = 18;

    // If a voting token address was provided, fetch the name and decimals
    if (votingTokenAddress) {
      signale.pending("Fetching data from voting token...");

      const token = council.token(votingTokenAddress as `0x${string}`);
      const tokenName = await token.getName();
      decimals = await token.getDecimals();

      signale.success(`Data successfully fetched from voting token`);

      contractInfos.push({
        name: tokenName,
        address: votingTokenAddress,
      });
    }

    // Deploy a mock voting token if no voting token address was provided
    if (!votingTokenAddress) {
      const tokenName = await options.tokenName({
        prompt: "Enter voting token name",
      });

      const tokenSymbol = await options.tokenSymbol({
        prompt: "Enter voting token symbol",
      });

      const tokenDeployData: DeployedContract = await fork({
        commands: [deployMockErc20Command],
        initialData: data,
        optionValues: {
          name: tokenName,
          symbol: tokenSymbol,
        },
      });
      contractInfos.push({
        name: tokenName,
        ...tokenDeployData,
      });
      votingTokenAddress = tokenDeployData.address;
    }

    // =========================================================================
    // 2. GSC CoreVoting
    // =========================================================================

    const gscQuorum = await options.gscQuorum({
      prompt: "Enter GSC quorum",
    });

    const gscCoreVotingDeployData: DeployedContract = await fork({
      commands: [deployCoreVotingCommand],
      initialData: data,
      optionValues: {
        owner: account.address,
        quorum: gscQuorum,
        minPower: gscQuorum,
        decimals,
      },
    });
    contractInfos.push({
      name: "GSCCoreVoting",
      ...gscCoreVotingDeployData,
    });

    const gscCoreVoting = council.coreVoting({
      address: gscCoreVotingDeployData.address,
    });
    const gscLockDuration = await options.gscLockDuration();

    // Set the GSC CoreVoting lock duration if provided
    if (gscLockDuration) {
      signale.pending(
        `Setting GSC CoreVoting lock duration to ${gscLockDuration}...`,
      );

      const hash = await gscCoreVoting.setLockDuration({
        blocks: BigInt(gscLockDuration),
      });

      signale.pending(`GSC CoreVoting lock duration tx submitted: ${hash}`);
      await publicClient.waitForTransactionReceipt({ hash });
      signale.success(
        `Successfully set GSC CoreVoting lock duration to ${gscLockDuration}`,
      );
    }

    const gscExtraVotingBlocks = await options.gscExtraVotingBlocks();

    // Set the GSC CoreVoting extra voting time if provided
    if (gscExtraVotingBlocks) {
      signale.pending(
        `Setting GSC CoreVoting extra voting time to ${gscExtraVotingBlocks}...`,
      );

      const hash = await gscCoreVoting.changeExtraVotingTime({
        extraVoteBlocks: BigInt(gscExtraVotingBlocks),
      });

      signale.pending(`GSC CoreVoting extra voting time tx submitted: ${hash}`);
      await publicClient.waitForTransactionReceipt({ hash });
      signale.success(
        `Successfully set GSC CoreVoting extra voting time to ${gscExtraVotingBlocks}`,
      );
    }

    // =========================================================================
    // 3. Timelock
    // =========================================================================

    const timelockWaitTime = await options.timelockWaitTime({
      prompt: `Enter timelock wait time ${colors.dim("(in seconds)")}`,
    });

    const timelockDeployData: DeployedContract = await fork({
      commands: [deployTimelockCommand],
      initialData: data,
      optionValues: {
        waitTime: timelockWaitTime,
        gsc: gscCoreVotingDeployData.address,
      },
    });
    contractInfos.push({
      name: "Timelock",
      ...timelockDeployData,
    });

    // =========================================================================
    // 4. Treasury
    // =========================================================================

    const treasuryAddress = await options.treasuryAddress({
      prompt: `Enter Treasury address ${colors.dim(
        "(leave blank to deploy a new one)",
      )}`,
    });

    if (!treasuryAddress) {
      const treasuryDeployData: DeployedContract = await fork({
        commands: [deployTreasuryCommand],
        initialData: data,
        optionValues: {
          owner: timelockDeployData.address,
        },
      });
      contractInfos.push({
        name: "Treasury",
        ...treasuryDeployData,
      });
    }

    // =========================================================================
    // 5. Voting Vaults
    // =========================================================================

    const staleBlockLag = await options.staleBlockLag({
      prompt: "Enter stale block lag",
    });

    if (chain.id === 31337) {
      // Calling queryVotePower on a voting vault that has a stale block lag larger
      // than the current block height will result in an error. To avoid this, we
      // we fast forward the block height by the stale block lag.
      signale.pending(
        `Fast forwarding block height by ${staleBlockLag} blocks...`,
      );

      const blockNumber = await mine({ blocks: staleBlockLag, rpcUrl });

      signale.success(
        `Successfully fast forwarded block height to ${blockNumber}`,
      );
    }

    const lockingVaultDeployData: DeployedContract = await fork({
      commands: [deployLockingVaultCommand],
      initialData: data,
      optionValues: {
        token: votingTokenAddress,
        staleBlockLag,
      },
    });
    contractInfos.push({
      name: "LockingVault",
      ...lockingVaultDeployData,
    });

    const lockVaultProxyDeployData: DeployedContract = await fork({
      commands: [deploySimpleProxyCommand],
      initialData: data,
      optionValues: {
        owner: timelockDeployData.address,
        implementation: lockingVaultDeployData.address,
      },
    });

    contractInfos.push({
      name: "LockingVaultProxy",
      ...lockVaultProxyDeployData,
    });

    // =========================================================================
    // 6. CoreVoting
    // =========================================================================

    const baseQuorum = await options.baseQuorum({
      prompt: "Enter base quorum",
    });

    const minProposalPower = await options.minProposalPower({
      prompt: "Enter minimum proposal power",
    });

    const coreVotingDeployData: DeployedContract = await fork({
      commands: [deployCoreVotingCommand],
      initialData: data,
      optionValues: {
        quorum: baseQuorum,
        minPower: minProposalPower,
        decimals,
        gsc: gscCoreVotingDeployData.address,
        vaults: [lockVaultProxyDeployData.address],
      },
    });
    contractInfos.push({
      name: "CoreVoting",
      ...coreVotingDeployData,
    });

    const coreVoting = council.coreVoting({
      address: coreVotingDeployData.address,
    });
    const lockDuration = await options.lockDuration();

    // Set the CoreVoting lock duration if provided
    if (lockDuration) {
      signale.pending(`Setting CoreVoting lock duration to ${lockDuration}...`);

      const hash = await coreVoting.setLockDuration({
        blocks: BigInt(lockDuration),
      });

      signale.pending(`CoreVoting lock duration tx submitted: ${hash}`);
      await publicClient.waitForTransactionReceipt({ hash });
      signale.success(
        `Successfully set CoreVoting lock duration to ${lockDuration}`,
      );
    }

    const extraVotingBlocks = await options.extraVotingBlocks();

    // Set the CoreVoting extra voting time if provided
    if (extraVotingBlocks) {
      signale.pending(
        `Setting CoreVoting extra voting time to ${extraVotingBlocks}...`,
      );

      const hash = await coreVoting.changeExtraVotingTime({
        extraVoteBlocks: BigInt(extraVotingBlocks),
      });

      signale.pending(`CoreVoting extra voting time tx submitted: ${hash}`);

      await publicClient.waitForTransactionReceipt({ hash });

      signale.success(
        `Successfully set CoreVoting extra voting time to ${extraVotingBlocks}`,
      );
    }

    // =========================================================================
    // 6. GSCVault
    // =========================================================================

    const gscVotingPowerBound = await options.gscVotingPowerBound({
      prompt: "Enter GSC voting power bound",
    });

    const gscVaultDeployData: DeployedContract = await fork({
      commands: [deployGscVaultCommand],
      initialData: data,
      optionValues: {
        coreVoting: coreVotingDeployData.address,
        votingPowerBound: gscVotingPowerBound,
        decimals,
        owner: timelockDeployData.address,
      },
    });
    contractInfos.push({
      name: "GSCVault",
      ...gscVaultDeployData,
    });

    const gscIdleDuration = await options.gscIdleDuration();

    // Set the GSCVault idle duration if provided
    if (gscIdleDuration) {
      signale.pending(
        `Setting GSCVault idle duration to ${gscIdleDuration}...`,
      );

      const gscVault = council.gscVault(gscCoreVotingDeployData.address);
      const hash = await gscVault.setIdleDuration({
        duration: BigInt(gscIdleDuration),
      });

      signale.pending(`GSCVault idle duration tx submitted: ${hash}`);
      await publicClient.waitForTransactionReceipt({ hash });
      signale.success(
        `Successfully set GSCVault idle duration to ${gscIdleDuration}`,
      );
    }

    // Approve the GSCVault to be used by the GSC CoreVoting contract
    signale.pending("Changing GSCVault status in GSC CoreVoting");

    const gscVaultStatusHash = await coreVoting.changeVaultStatus({
      vault: gscVaultDeployData.address,
      isValid: true,
    });

    signale.pending(`GSCVault status tx submitted: ${gscVaultStatusHash}`);
    await publicClient.waitForTransactionReceipt({ hash: gscVaultStatusHash });
    signale.success("Successfully changed GSCVault status in GSC CoreVoting");

    // =========================================================================
    // 7. Lock it down
    // =========================================================================

    signale.pending("Setting GSC CoreVoting owner to Timelock...");

    const gscCoreVotingOwnerHash = await walletClient.writeContract({
      abi: CoreVoting.abi,
      address: gscCoreVotingDeployData.address as Address,
      functionName: "setOwner",
      args: [timelockDeployData.address],
    });

    signale.pending(
      `GSC CoreVoting owner tx submitted: ${gscCoreVotingOwnerHash}`,
    );
    await publicClient.waitForTransactionReceipt({
      hash: gscCoreVotingOwnerHash,
    });
    signale.success("Successfully set GSC CoreVoting owner to Timelock");
    signale.pending("Setting CoreVoting owner to Timelock...");

    const coreVotingOwnerHash = await walletClient.writeContract({
      abi: CoreVoting.abi,
      address: coreVoting.address as Address,
      functionName: "setOwner",
      args: [timelockDeployData.address],
    });

    signale.pending(`CoreVoting owner tx submitted: ${coreVotingOwnerHash}`);
    await publicClient.waitForTransactionReceipt({ hash: coreVotingOwnerHash });
    signale.success("Successfully set CoreVoting owner to Timelock");
    signale.pending("Setting Timelock owner to CoreVoting...");

    const timelockOwnerHash = await walletClient.writeContract({
      abi: Timelock.abi,
      address: timelockDeployData.address,
      functionName: "setOwner",
      args: [coreVoting.address],
    });

    signale.pending(`Timelock owner tx submitted: ${timelockOwnerHash}`);
    await publicClient.waitForTransactionReceipt({ hash: timelockOwnerHash });
    signale.success("Successfully set Timelock owner to CoreVoting");

    // =========================================================================
    // 8. Save the addresses
    // =========================================================================

    const deploymentName = await options.name({
      prompt: "Enter deployment name",
    });

    const outDir = await options.outDir({
      prompt: "Enter output directory",
    });

    const store = getDeploymentStore(deploymentName, chain.id, outDir);
    await store.set({
      name: deploymentName,
      chainId: chain.id,
      timestamp: Date.now(),
      deployer: account.address,
      contracts: stringifyBigInts(contractInfos),
    });

    // =========================================================================
    // 9. DONE!
    // =========================================================================

    console.log("\n");
    signale.success("Council contracts deployed successfully!");
    console.log("\n");

    console.log(colors.dim(`${"=".repeat(80)}`));
    contractInfos.forEach((contractInfo, i) => {
      if (i !== 0) {
        console.log(colors.dim(`${"-".repeat(80)}`));
      }
      console.log(`${contractInfo.name}: ${contractInfo.address}`);
    });
    console.log(colors.dim(`${"=".repeat(80)}`));

    next(contractInfos);
  },
});
