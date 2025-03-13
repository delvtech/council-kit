import { z } from "zod";
import { ConfiguredChain } from "./lib/viem.js";
import { Decimal, Hex } from "./lib/zod.js";
import { DAY_IN_BLOCKS, DAY_IN_SECONDS } from "./utils/constants.js";
import { getAppRootDir } from "./utils/getAppRootDir.js";
import { JsonStore } from "./utils/JsonStore.js";

// Schema //

const Empty = z
  .literal("")
  .optional()
  .transform(() => undefined);

const CouncilCliConfig = z
  .object({
    // Network
    chain: z.string(),
    rpcUrl: z.string(),
    forkChain: z.string(),
    forkUrl: z.string(),

    // Deployments
    deploymentsDir: z.string(),
    extraVotingBlocks: z.coerce.number(),
    gscExtraVotingBlocks: z.coerce.number(),
    gscIdleDuration: z.coerce.number(),
    gscLockDuration: z.coerce.number(),
    gscQuorum: Decimal.or(Empty),
    gscVotingPowerBound: Decimal.or(Empty),
    lockDuration: z.coerce.number(),
    minProposalPower: Decimal.or(Empty),
    quorum: Decimal.or(Empty),
    staleBlockLag: z.coerce.number(),
    timelockWaitTime: z.coerce.number(),
    token: Hex.or(Empty),
    tokenName: z.string(),
    tokenSymbol: z.string(),
    treasury: Hex.or(Empty),
  })
  .partial();
export type CouncilCliConfig = z.infer<typeof CouncilCliConfig>;

const Setting = CouncilCliConfig.keyof();
export type Setting = z.infer<typeof Setting>;

export const settings = Object.values(Setting.Values);
export const optionalSettings = Object.keys(CouncilCliConfig.shape).filter(
  (key) => CouncilCliConfig.shape[key as Setting].isOptional(),
);

// Store //

export const config = new JsonStore({
  path: getAppRootDir(),
  name: "council-cli",
  schema: CouncilCliConfig,
  defaults: {
    // Network
    chain: process.env.CHAIN || "hardhat",
    rpcUrl: process.env.RPC_URL || "http://127.0.0.1:8545",
    forkChain: process.env.FORK_CHAIN as ConfiguredChain | undefined,
    forkUrl: process.env.FORK_URL,

    // Deployments
    deploymentsDir: process.env.DEPLOYMENTS_DIR || "./deployments",
    extraVotingBlocks: process.env.EXTRA_VOTING_BLOCKS
      ? +process.env.EXTRA_VOTING_BLOCKS
      : undefined,
    gscExtraVotingBlocks: process.env.GSC_EXTRA_VOTING_BLOCKS
      ? +process.env.GSC_EXTRA_VOTING_BLOCKS
      : undefined,
    gscIdleDuration: process.env.GSC_IDLE_DURATION
      ? +process.env.GSC_IDLE_DURATION
      : undefined,
    gscLockDuration: process.env.GSC_LOCK_DURATION
      ? +process.env.GSC_LOCK_DURATION
      : undefined,
    gscQuorum: (process.env.GSC_QUORUM as Decimal | undefined) || "3.0",
    gscVotingPowerBound:
      (process.env.GSC_VOTING_POWER_BOUND as Decimal | undefined) || "100000.0",
    lockDuration: process.env.LOCK_DURATION
      ? +process.env.LOCK_DURATION
      : undefined,
    minProposalPower:
      (process.env.MIN_PROPOSAL_POWER as Decimal | undefined) || "25000.0",
    quorum: (process.env.BASE_QUORUM as Decimal | undefined) || "1000000.0",
    staleBlockLag: process.env.STALE_BLOCK_LAG
      ? +process.env.STALE_BLOCK_LAG
      : DAY_IN_BLOCKS * 28,
    timelockWaitTime: process.env.TIMELOCK_WAIT_TIME
      ? +process.env.TIMELOCK_WAIT_TIME
      : DAY_IN_SECONDS * 3,
    token: process.env.VOTING_TOKEN_ADDRESS as Hex | undefined,
    tokenName: process.env.VOTING_TOKEN_NAME || "Mock Voting Token",
    tokenSymbol: process.env.VOTING_TOKEN_SYMBOL || "MVT",
    treasury: process.env.TREASURY_ADDRESS as Hex | undefined,
  },
});

const token = config.get("token");
