import {
  CoreVoting__factory,
  GSCVault__factory,
  MockERC20__factory,
  Timelock__factory,
} from "@council/typechain";
import colors from "colors";
import signale from "signale";
import { chainOption, requiredChain } from "src/options/chain";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { stringifyBigInts } from "src/utils/bigint/stringifyBigInts";
import {
  DAY_IN_BLOCKS,
  DAY_IN_SECONDS,
  ZERO_ADDRESS,
} from "src/utils/constants";
import { createCommandModule } from "src/utils/createCommandModule";
import {
  Address,
  createPublicClient,
  createWalletClient,
  Hex,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { deployCoreVoting } from "./core-voting";
import { deployGSCVault } from "./gsc-vault";
import { deployLockingVault } from "./locking-vault";
import { deployMockERC20 } from "./mock-erc20";
import { deploySimpleProxy } from "./simple-proxy";
import { deployTimelock } from "./timelock";
import { deployTreasury } from "./treasury";
import {
  ContractInfo,
  DEFAULT_DEPLOYMENTS_DIR,
  getDeploymentStore,
} from "./utils/deploymentStore";

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
  timelockWaitTime: +(process.env.TIMELOCK_WAIT_TIME || DAY_IN_SECONDS * 3),
  treasuryAddress: process.env.TREASURY_ADDRESS,
  staleBlockLag: DAY_IN_BLOCKS * 28,
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

export const { command, describe, builder, handler } = createCommandModule({
  command: "default [OPTIONS]",
  describe:
    "Deploy a default version of Council which includes 2 CoreVoting contracts - 1 for general voting with power from a LockingVault deployed behind a SimpleProxy contract, and another for GSC voting with membership in a GSCVault. Also deployed will be a Timelock, Treasury, and if no voting token address is provided, a mock voting token.",

  builder: (yargs) => {
    const result = yargs.options({
      "token-address": {
        describe: "The address of the token used for voting.",
        type: "string",
        default: defaults.tokenAddress,
      },
      "token-name": {
        describe:
          "The name of the mock token to be deployed for voting if no token address is provided.",
        type: "string",
        default: defaults.tokenName,
      },
      "token-symbol": {
        describe:
          "The symbol of the mock token to be deployed for voting if no token address is provided.",
        type: "string",
        default: defaults.tokenSymbol,
      },
      "base-quorum": {
        describe:
          "The minimum voting power required for a proposal to pass. Will be scaled by 10 ** token.decimals.",
        type: "string",
        default: defaults.baseQuorum,
      },
      "min-proposal-power": {
        describe:
          "The minimum voting power required to create a proposal. Will be scaled by 10 ** token.decimals.",
        type: "string",
        default: defaults.minProposalPower,
      },
      "lock-duration": {
        describe:
          "The number of blocks a proposal must wait before it can be executed.",
        type: "number",
        default: defaults.lockDuration,
      },
      "extra-voting-blocks": {
        describe:
          "The number of blocks for which a proposal can still be voted on after it's unlocked.",
        type: "number",
        default: defaults.extraVotingBlocks,
      },
      "timelock-wait-time": {
        describe:
          "The amount of time (in seconds) a proposal must wait in the timelock before it can be executed.",
        type: "number",
        default: defaults.timelockWaitTime,
      },
      "treasury-address": {
        describe: "The address of the treasury contract.",
        type: "string",
        default: defaults.treasuryAddress,
      },
      "stale-block-lag": {
        describe:
          "The number of blocks before the delegation history is forgotten. Voting power can't be used on proposals that are older than the stale block lag.",
        type: "number",
        default: defaults.staleBlockLag,
      },
      "gsc-quorum": {
        describe:
          "The minimum voting power required for a GSC proposal to pass.",
        type: "string",
        default: defaults.gscQuorum,
      },
      "gsc-lock-duration": {
        describe:
          "The number of blocks a GSC proposal must wait before it can be executed.",
        type: "number",
        default: defaults.gscLockDuration,
      },
      "gsc-extra-voting-blocks": {
        describe:
          "The number of blocks for which a GSC proposal can still be voted on after it's unlocked.",
        type: "number",
        default: defaults.gscExtraVotingBlocks,
      },
      "gsc-voting-power-bound": {
        describe:
          "The minimum voting power required to become a member of the GSC. Will be scaled by 10 ** token.decimals.",
        type: "string",
        default: defaults.gscVotingPowerBound,
      },
      "gsc-idle-duration": {
        describe:
          "The amount of time (in seconds) a new GSC member must wait after joining before they can vote.",
        type: "number",
        default: defaults.gscIdleDuration,
      },
      o: {
        alias: ["out-dir"],
        describe:
          "The directory to write the contract addresses to; relative to the current working directory.",
        type: "string",
        default: defaults.outDir,
      },
      n: {
        alias: ["name"],
        describe: "The name of the deployment.",
        type: "string",
        default: defaults.name,
      },
      c: chainOption,
      r: rpcUrlOption,
      w: walletKeyOption,
    });
    return result;
  },

  handler: async (args) => {
    const chain = await requiredChain(args.chain);
    const rpcUrl = await requiredRpcUrl(args.rpcUrl);
    const walletKey = await requiredWalletKey(args.walletKey);

    const account = privateKeyToAccount(walletKey as Hex);

    const publicClient = createPublicClient({
      transport: http(rpcUrl),
      chain,
    });

    const walletClient = createWalletClient({
      account,
      transport: http(rpcUrl),
      chain,
    });

    const contractInfos: ContractInfo[] = [];

    signale.pending("Deploying Council contracts...");

    // =========================================================================
    // 1. Voting Token
    // =========================================================================

    let votingTokenAddress = await requiredString(args.tokenAddress, {
      name: "token-address",
      message: `Enter voting token address ${colors.dim(
        "(leave blank to deploy a mock voting token)",
      )}`,
      initial: defaults.tokenAddress,
      validate: () => true,
    });

    // Used to scale voting power to match the token's decimals
    let decimals = 18;

    // If a voting token address was provided, fetch the name and decimals
    if (votingTokenAddress) {
      signale.pending("Fetching data from voting token...");

      const tokenName = (await publicClient.readContract({
        abi: MockERC20__factory.abi,
        address: votingTokenAddress as Address,
        functionName: "name",
      })) as string;

      decimals = (await publicClient.readContract({
        abi: MockERC20__factory.abi,
        address: votingTokenAddress as Address,
        functionName: "decimals",
      })) as number;

      signale.success(`Data successfully fetched from voting token`);

      contractInfos.push({
        name: tokenName,
        address: votingTokenAddress,
      });
    }

    // Deploy a mock voting token if no voting token address was provided
    if (!votingTokenAddress) {
      const tokenName = await requiredString(args.tokenName, {
        name: "token-name",
        message: "Enter voting token name",
        initial: defaults.tokenName,
      });

      const tokenSymbol = await requiredString(args.tokenSymbol, {
        name: "token-symbol",
        message: "Enter voting token symbol",
        initial: defaults.tokenSymbol,
      });

      signale.pending("Deploying MockERC20...");

      const mockERC20 = await deployMockERC20({
        tokenName,
        tokenSymbol,
        account,
        rpcUrl,
        chain,
        onSubmitted: (hash) => {
          signale.pending(`MockERC20 deployment tx submitted: ${hash}`);
        },
      });

      signale.success(`MockERC20 deployed @ ${mockERC20.address}`);
      votingTokenAddress = mockERC20.address;

      contractInfos.push({
        name: tokenName,
        ...mockERC20,
      });
    }

    // =========================================================================
    // 2. GSC CoreVoting
    // =========================================================================

    const gscQuorum = await requiredString(args.gscQuorum, {
      name: "gsc-quorum",
      message: "Enter GSC quorum",
      initial: defaults.gscQuorum,
    });

    signale.pending("Deploying GSC CoreVoting...");

    const gscCoreVoting = await deployCoreVoting({
      quorum: gscQuorum,
      // As long as you're a member, you can create a proposal
      minPower: "1",
      // All members get 1 vote
      decimals: 0,
      // There is no GSC for the GSC
      gsc: ZERO_ADDRESS,
      // The GSC vault depends on the regular CoreVoting contract being deployed
      // first so we'll approve it later
      vaults: [],
      account,
      rpcUrl,
      chain,
      onSubmitted: (hash) => {
        signale.pending(`GSC CoreVoting deployment tx submitted: ${hash}`);
      },
    });

    signale.success(`GSC CoreVoting deployed @ ${gscCoreVoting.address}`);

    contractInfos.push({
      name: "GSCCoreVoting",
      ...gscCoreVoting,
    });

    // Set the GSC CoreVoting lock duration if provided
    if (args.gscLockDuration) {
      signale.pending(
        `Setting GSC CoreVoting lock duration to ${args.gscLockDuration}...`,
      );

      const hash = await walletClient.writeContract({
        abi: CoreVoting__factory.abi,
        address: gscCoreVoting.address as Address,
        functionName: "setLockDuration",
        args: [args.gscLockDuration],
      });

      signale.pending(`GSC CoreVoting lock duration tx submitted: ${hash}`);

      await publicClient.waitForTransactionReceipt({ hash });

      signale.success(
        `Successfully set GSC CoreVoting lock duration to ${args.gscLockDuration}`,
      );
    }

    // Set the GSC CoreVoting extra voting time if provided
    if (args.gscExtraVotingBlocks) {
      signale.pending(
        `Setting GSC CoreVoting extra voting time to ${args.gscExtraVotingBlocks}...`,
      );

      const hash = await walletClient.writeContract({
        abi: CoreVoting__factory.abi,
        address: gscCoreVoting.address as Address,
        functionName: "changeExtraVotingTime",
        args: [args.gscExtraVotingBlocks],
      });

      signale.pending(`GSC CoreVoting extra voting time tx submitted: ${hash}`);

      await publicClient.waitForTransactionReceipt({ hash });

      signale.success(
        `Successfully set GSC CoreVoting extra voting time to ${args.gscExtraVotingBlocks}`,
      );
    }

    // =========================================================================
    // 3. Timelock
    // =========================================================================

    const timelockWaitTime = await requiredNumber(args.timelockWaitTime, {
      name: "timelock-wait-time",
      message: `Enter timelock wait time ${colors.dim("(in seconds)")}`,
      initial: defaults.timelockWaitTime,
    });

    signale.pending("Deploying Timelock...");

    const timelock = await deployTimelock({
      waitTime: timelockWaitTime,
      gsc: gscCoreVoting.address,
      account,
      rpcUrl,
      chain,
      onSubmitted: (hash) => {
        signale.pending(`Timelock deployment tx submitted: ${hash}`);
      },
    });

    signale.success(`Timelock deployed @ ${timelock.address}`);

    contractInfos.push({
      name: "Timelock",
      ...timelock,
    });

    // =========================================================================
    // 4. Treasury
    // =========================================================================

    let treasuryAddress = await requiredString(args.treasuryAddress, {
      name: "treasury-address",
      message: `Enter Treasury address ${colors.dim(
        "(leave blank to deploy a new one)",
      )}`,
      initial: defaults.treasuryAddress,
      validate: () => true,
    });

    if (!treasuryAddress) {
      signale.pending("Deploying Treasury...");

      const treasury = await deployTreasury({
        owner: timelock.address,
        account,
        rpcUrl,
        chain,
        onSubmitted: (hash) => {
          signale.pending(`Treasury deployment tx submitted: ${hash}`);
        },
      });

      signale.success(`Treasury deployed @ ${treasury.address}`);
      treasuryAddress = treasury.address;

      contractInfos.push({
        name: "Treasury",
        ...treasury,
      });
    }

    // =========================================================================
    // 5. Voting Vaults
    // =========================================================================

    const staleBlockLag = await requiredNumber(args.staleBlockLag, {
      name: "stale-block-lag",
      message: "Enter stale block lag",
      initial: defaults.staleBlockLag,
    });

    signale.pending("Deploying LockingVault...");

    const lockingVault = await deployLockingVault({
      token: votingTokenAddress,
      staleBlockLag,
      account,
      rpcUrl,
      chain,
      onSubmitted: (hash) => {
        signale.pending(`LockingVault deployment tx submitted: ${hash}`);
      },
    });

    signale.success(`LockingVault deployed @ ${lockingVault.address}`);

    contractInfos.push({
      name: "LockingVault",
      ...lockingVault,
    });

    signale.pending("Deploying LockingVault SimpleProxy...");

    const lockingVaultProxy = await deploySimpleProxy({
      owner: timelock.address,
      implementation: lockingVault.address,
      account,
      rpcUrl,
      chain,
      onSubmitted: (hash) => {
        signale.pending(
          `LockingVault SimpleProxy deployment tx submitted: ${hash}`,
        );
      },
    });

    signale.success(
      `LockingVault SimpleProxy deployed @ ${lockingVaultProxy.address}`,
    );

    contractInfos.push({
      name: "LockingVaultProxy",
      ...lockingVaultProxy,
    });

    // =========================================================================
    // 6. CoreVoting
    // =========================================================================

    const baseQuorum = await requiredString(args.baseQuorum, {
      name: "base-quorum",
      message: "Enter base quorum",
      initial: defaults.baseQuorum,
    });

    const minProposalPower = await requiredString(args.minProposalPower, {
      name: "min-proposal-power",
      message: "Enter minimum proposal power",
      initial: defaults.minProposalPower,
    });

    signale.pending("Deploying CoreVoting...");

    const coreVoting = await deployCoreVoting({
      quorum: baseQuorum,
      minPower: minProposalPower,
      decimals,
      gsc: gscCoreVoting.address,
      vaults: [lockingVaultProxy.address],
      account,
      rpcUrl,
      chain,
      onSubmitted: (hash) => {
        signale.pending(`CoreVoting deployment tx submitted: ${hash}`);
      },
    });

    signale.success(`CoreVoting deployed @ ${coreVoting.address}`);

    contractInfos.push({
      name: "CoreVoting",
      ...coreVoting,
    });

    // Set the CoreVoting lock duration if provided
    if (args.lockDuration) {
      signale.pending(
        `Setting CoreVoting lock duration to ${args.lockDuration}...`,
      );

      const hash = await walletClient.writeContract({
        abi: CoreVoting__factory.abi,
        address: coreVoting.address as Address,
        functionName: "setLockDuration",
        args: [args.lockDuration],
      });

      signale.pending(`CoreVoting lock duration tx submitted: ${hash}`);

      await publicClient.waitForTransactionReceipt({ hash });

      signale.success(
        `Successfully set CoreVoting lock duration to ${args.lockDuration}`,
      );
    }

    // Set the CoreVoting extra voting time if provided
    if (args.extraVotingBlocks) {
      signale.pending(
        `Setting CoreVoting extra voting time to ${args.extraVotingBlocks}...`,
      );

      const hash = await walletClient.writeContract({
        abi: CoreVoting__factory.abi,
        address: coreVoting.address as Address,
        functionName: "changeExtraVotingTime",
        args: [args.extraVotingBlocks],
      });

      signale.pending(`CoreVoting extra voting time tx submitted: ${hash}`);

      await publicClient.waitForTransactionReceipt({ hash });

      signale.success(
        `Successfully set CoreVoting extra voting time to ${args.extraVotingBlocks}`,
      );
    }

    // =========================================================================
    // 6. GSCVault
    // =========================================================================

    const gscVotingPowerBound = await requiredString(args.gscVotingPowerBound, {
      name: "gsc-voting-power-bound",
      message: "Enter GSC voting power bound",
      initial: defaults.gscVotingPowerBound,
    });

    signale.pending("Deploying GSCVault...");

    const gscVault = await deployGSCVault({
      coreVoting: coreVoting.address,
      votingPowerBound: gscVotingPowerBound,
      decimals,
      owner: timelock.address,
      account,
      rpcUrl,
      chain,
      onSubmitted: (hash) => {
        signale.pending(`GSCVault deployment tx submitted: ${hash}`);
      },
    });

    signale.success(`GSCVault deployed @ ${gscVault.address}`);

    contractInfos.push({
      name: "GSCVault",
      ...gscVault,
    });

    // Set the GSCVault idle duration if provided
    if (args.gscIdleDuration) {
      signale.pending(
        `Setting GSCVault idle duration to ${args.gscIdleDuration}...`,
      );

      const hash = await walletClient.writeContract({
        abi: GSCVault__factory.abi,
        address: gscVault.address as Address,
        functionName: "setIdleDuration",
        args: [args.gscIdleDuration],
      });

      signale.pending(`GSCVault idle duration tx submitted: ${hash}`);

      await publicClient.waitForTransactionReceipt({ hash });

      signale.success(
        `Successfully set GSCVault idle duration to ${args.gscIdleDuration}`,
      );
    }

    // Approve the GSCVault to be used by the GSC CoreVoting contract
    signale.pending("Changing GSCVault status in GSC CoreVoting");

    const gscVaultStatusHash = await walletClient.writeContract({
      abi: CoreVoting__factory.abi,
      address: gscCoreVoting.address as Address,
      functionName: "changeVaultStatus",
      args: [gscVault.address, true],
    });

    signale.pending(`GSCVault status tx submitted: ${gscVaultStatusHash}`);

    await publicClient.waitForTransactionReceipt({ hash: gscVaultStatusHash });

    signale.success("Successfully changed GSCVault status in GSC CoreVoting");

    // =========================================================================
    // 7. Lock it down
    // =========================================================================

    signale.pending("Setting GSC CoreVoting owner to Timelock...");

    const gscCoreVotingOwnerHash = await walletClient.writeContract({
      abi: CoreVoting__factory.abi,
      address: gscCoreVoting.address as Address,
      functionName: "setOwner",
      args: [timelock.address],
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
      abi: CoreVoting__factory.abi,
      address: coreVoting.address as Address,
      functionName: "setOwner",
      args: [timelock.address],
    });

    signale.pending(`CoreVoting owner tx submitted: ${coreVotingOwnerHash}`);

    await publicClient.waitForTransactionReceipt({ hash: coreVotingOwnerHash });
    signale.success("Successfully set CoreVoting owner to Timelock");

    signale.pending("Setting Timelock owner to CoreVoting...");

    const timelockOwnerHash = await walletClient.writeContract({
      abi: Timelock__factory.abi,
      address: timelock.address as Address,
      functionName: "setOwner",
      args: [coreVoting.address],
    });

    signale.pending(`Timelock owner tx submitted: ${timelockOwnerHash}`);

    await publicClient.waitForTransactionReceipt({ hash: timelockOwnerHash });

    signale.success("Successfully set Timelock owner to CoreVoting");

    // =========================================================================
    // 8. Save the addresses
    // =========================================================================

    const deploymentName = await requiredString(args.name, {
      name: "name",
      message: "Enter deployment name",
      initial: defaults.name,
    });

    const outDir = await requiredString(args.outDir, {
      name: "out-dir",
      message: "Enter output directory",
      initial: defaults.outDir,
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
  },
});
