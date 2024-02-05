import { ViemReadWriteCouncil } from "@delvtech/council-viem";
import { command } from "clide-js";
import colors from "colors";
import signale from "signale";
import { createPublicClient, createWalletClient, http } from "viem";
import { WriteOptions } from "../../reusable-options/write-options.js";
import { DAY_IN_BLOCKS } from "../../utils/constants.js";
import { DeployedContract } from "../../utils/deployContract.js";
import { stringifyBigInts } from "../../utils/stringifyBigInts.js";
import { mine } from "../../viem/utils/mine.js";
import deployCoreVotingCommand from "./core-voting.js";
import deployLockingVaultCommand from "./locking-vault.js";
import deployMockErc20Command from "./mock-erc20.js";
import deploySimpleProxyCommand from "./simple-proxy.js";
import deployTreasury from "./treasury.js";
import {
  ContractInfo,
  DEFAULT_DEPLOYMENTS_DIR,
  getDeploymentStore,
} from "./utils/deploymentStore.js";

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
  treasuryAddress: process.env.TREASURY_ADDRESS,
  staleBlockLag: DAY_IN_BLOCKS * 28n,
  outDir: DEFAULT_DEPLOYMENTS_DIR,
  name: "simple",
};

export default command({
  description:
    "Deploy a simple version of Council which includes 1 CoreVoting contract for general voting with power from a LockingVault deployed behind a SimpleProxy contract. Also deployed will be a Treasury, and if no voting token address is provided, a mock voting token.",

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
    o: {
      alias: ["out-dir"],
      description:
        "The directory to write the contract addresses to; relative to the current working directory.",
      type: "string",
      default: defaults.outDir,
      required: true,
    },
    n: {
      alias: ["name"],
      description: "The name of the deployment.",
      type: "string",
      default: defaults.name,
    },
  },

  handler: async ({ data, options, next, context }) => {
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
    const council = new ViemReadWriteCouncil({ publicClient, walletClient });

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

      const tokenDeployData: DeployedContract = await context.invokeCommands({
        commands: [deployMockErc20Command],
        initialData: data,
        optionValues: {
          name: tokenName,
          symbol: tokenSymbol,
        },
      });

      votingTokenAddress = tokenDeployData.address;

      contractInfos.push({
        name: tokenName,
        ...tokenDeployData,
      });
    }

    // =========================================================================
    // 2. CoreVoting
    // =========================================================================

    const baseQuorum = await options.baseQuorum({
      prompt: "Enter base quorum",
    });

    const minProposalPower = await options.minProposalPower({
      prompt: "Enter minimum proposal power",
    });

    const coreVotingDeployData: DeployedContract = await context.invokeCommands(
      {
        commands: [deployCoreVotingCommand],
        initialData: data,
        optionValues: {
          quorum: baseQuorum,
          minPower: minProposalPower,
          decimals,
        },
      },
    );

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
    // 3. Voting Vaults
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

    const lockingVaultDeployData: DeployedContract =
      await context.invokeCommands({
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

    const lockVaultProxyDeployData: DeployedContract =
      await context.invokeCommands({
        commands: [deploySimpleProxyCommand],
        initialData: data,
        optionValues: {
          owner: coreVotingDeployData.address,
          implementation: lockingVaultDeployData.address,
        },
      });
    contractInfos.push({
      name: "LockingVaultProxy",
      ...lockVaultProxyDeployData,
    });

    // Approve the vault to be used by the CoreVoting contract
    signale.pending("Changing LockingVault SimpleProxy status in CoreVoting");

    const lockingVaultStatusHash = await coreVoting.changeVaultStatus({
      vault: lockVaultProxyDeployData.address,
      isValid: true,
    });

    signale.pending(
      `LockingVault SimpleProxy status tx submitted: ${lockingVaultStatusHash}`,
    );
    await publicClient.waitForTransactionReceipt({
      hash: lockingVaultStatusHash,
    });
    signale.success(
      "Successfully changed LockingVault SimpleProxy status in CoreVoting",
    );

    // =========================================================================
    // 4. Treasury
    // =========================================================================

    const treasuryAddress = await options.treasuryAddress({
      prompt: `Enter Treasury address ${colors.dim(
        "(leave blank to deploy a new one)",
      )}`,
    });

    if (!treasuryAddress) {
      signale.pending("Deploying Treasury...");

      const treasuryDeployData: DeployedContract = await context.invokeCommands(
        {
          commands: [deployTreasury],
          initialData: data,
          optionValues: {
            owner: coreVotingDeployData.address,
          },
        },
      );

      contractInfos.push({
        name: "Treasury",
        ...treasuryDeployData,
      });
    }

    // =========================================================================
    // 5. Save the addresses
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
    // 7. DONE!
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
