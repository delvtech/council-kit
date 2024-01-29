import { CoreVoting } from "@council/artifacts/dist/CoreVoting";
import {
  CachedReadContract,
  CachedReadWriteContract,
  ContractWriteOptions,
} from "@council/evm-client";
import { Signer } from "ethers";
import { BlockLike } from "src/contract/args";
import {
  Model,
  ReadContractModelOptions,
  ReadWriteContractModelOptions,
} from "src/models/Model";
import { ReadProposal } from "src/models/Proposal";
import { ReadVote } from "src/models/Vote";
import { ReadVoter } from "src/models/Voter";
import { ReadVotingVault } from "src/models/VotingVault/VotingVault";

const coreVotingAbi = CoreVoting.abi;
type CoreVotingAbi = typeof coreVotingAbi;

/**
 * @category Models
 */
export interface ReadCoreVotingOptions extends ReadContractModelOptions {
  vaults?: (ReadVotingVault | `0x${string}`)[];
}

/**
 * @category Models
 */
export class ReadCoreVoting extends Model {
  vaults: ReadVotingVault[];

  protected _contract: CachedReadContract<CoreVotingAbi>;

  /**
   * Create a new CoreVoting model instance.
   * @param address - The address of the deployed contract.
   * @param vaults - The VotingVault instances or addresses of the vaults that are
   *   approved for this voting contract.
   */
  constructor({
    address,
    contractFactory,
    network,
    cache,
    namespace,
    name,
    vaults = [],
  }: ReadCoreVotingOptions) {
    super({ contractFactory, network, name });
    this._contract = contractFactory({
      abi: coreVotingAbi,
      address,
      cache,
      namespace,
    });
    this.vaults = vaults.map((vault) =>
      typeof vault === "string"
        ? new ReadVotingVault({
            address: vault,
            contractFactory,
            network,
          })
        : vault,
    );
  }

  /**
   * Get a proposal by id.
   */
  async getProposal({ id }: { id: bigint }): Promise<ReadProposal | undefined> {
    const { created, expiration, lastCall, proposalHash, quorum, unlock } =
      await this._contract.read("proposals", id);

    if (proposalHash !== EXECUTED_PROPOSAL_HASH) {
      return new ReadProposal({
        id,
        created,
        expiration,
        lastCall,
        proposalHash,
        requiredQuorum: quorum,
        unlock,
        contractFactory: this._contractFactory,
        coreVoting: this,
        network: this._network,
      });
    }

    const createdEvents = await this._contract.getEvents("ProposalCreated");
    const createdEvent = createdEvents.find(
      ({ args: { proposalId } }) => proposalId === id,
    );

    if (createdEvent) {
      const {
        args: { created, execution, expiration },
      } = createdEvent;
      return new ReadProposal({
        id,
        created,
        expiration,
        unlock: execution,
        contractFactory: this._contractFactory,
        coreVoting: this,
        network: this._network,
      });
    }
  }

  /**
   * Get all proposals ever created.
   * @param fromBlock - Include all proposals created on or after this block number.
   * @param toBlock - Include all proposals created on or before this block number.
   */
  async getProposals({
    fromBlock,
    toBlock,
  }: {
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  } = {}): Promise<ReadProposal[]> {
    const createdEvents = await this._contract.getEvents("ProposalCreated", {
      fromBlock,
      toBlock,
    });
    return createdEvents.map(
      ({ args: { proposalId, created, execution, expiration } }) =>
        new ReadProposal({
          contractFactory: this._contractFactory,
          coreVoting: this,
          created,
          expiration,
          id: proposalId,
          unlock: execution,
          network: this._network,
        }),
    );
  }

  /**
   * Get the voting power owned by a given address in all vaults.
   * @param extraData - ABI encoded optional extra data used by some vaults, such
   *   as merkle proofs.
   */
  async getVotingPower({
    voter,
    atBlock,
    extraData,
  }: {
    voter: `0x${string}`;
    atBlock?: BlockLike;
    extraData?: `0x${string}`[];
  }): Promise<bigint> {
    const vaultPowers = await Promise.all(
      this.vaults.map((vault, i) =>
        vault.getVotingPower({
          voter,
          atBlock,
          extraData: extraData?.[i],
        }),
      ),
    );
    return vaultPowers.reduce((sum, power) => sum + power);
  }

  /**
   * Get all casted votes on proposals in this voting contract.
   * @param fromBlock - The starting block number for the range of blocks fetched.
   * @param toBlock - The ending block number for the range of blocks fetched.
   */
  async getVotes({
    proposalId,
    voter,
    fromBlock,
    toBlock,
  }: {
    proposalId?: bigint;
    voter?: ReadVoter | `0x${string}`;
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  }): Promise<ReadVote[]> {
    const voteEvents = await this._contract.getEvents("Voted", {
      filter: {
        voter: typeof voter === "string" || !voter ? voter : voter.address,
        proposalId,
      },
      fromBlock,
      toBlock,
    });

    const votes: ReadVote[] = [];

    for (const {
      args: {
        proposalId,
        vote: { castBallot, votingPower },
        voter,
      },
    } of voteEvents) {
      const proposal = await this.getProposal({ id: proposalId });
      votes.push(
        new ReadVote({
          ballot: BALLOTS[castBallot],
          contractFactory: this._contractFactory,
          network: this._network,
          power: votingPower,
          proposal: proposal!,
          voter,
        }),
      );
    }

    return votes;
  }

  /**
   * Get the number of proposals an address has voted on and the number of
   * proposals that they were able to vote on. If the numbers are the same, then
   * the address has voted on every proposal they were able to.
   */
  async getParticipation({
    voter,
    fromBlock,
    toBlock,
  }: {
    voter: ReadVoter | `0x${string}`;
    fromBlock?: BlockLike;
    toBlock?: BlockLike;
  }): Promise<[number, number]> {
    const votes = await this.getVotes({
      voter,
      fromBlock,
      toBlock,
    });
    const votedProposalIds = votes.map(({ proposal: { id } }) => id);
    const proposals = await this.getProposals();
    const proposalsNotVoted = await Promise.all(
      proposals
        .filter(({ id }) => !votedProposalIds.includes(id))
        .map(
          async (proposal) =>
            // could be null if the proposal has been deleted and the created
            // block can't be fetched.
            ((await proposal.getVotingPower({ voter })) || 0n) > 0n,
        ),
    );
    const missedVotesCount = proposalsNotVoted.filter(Boolean).length;
    return [proposals.length - missedVotesCount, proposals.length];
  }
}

export interface ReadWriteCoreVotingOptions
  extends ReadWriteContractModelOptions {
  vaults?: (ReadVotingVault | `0x${string}`)[];
}

export class ReadWriteCoreVoting extends ReadCoreVoting {
  protected declare _contract: CachedReadWriteContract<CoreVotingAbi>;

  constructor(options: ReadWriteCoreVotingOptions) {
    super(options);
  }

  /**
   * Create a new proposal.
   * @param vaults - The addresses of the approved vaults to draw voting power
   *   from.
   * @param targets - The targets (contract addresses) to call.
   * @param calldatas - The execution calldata for each target.
   * @param lastCall - The block number after which the proposal can't be executed.
   * @param ballot: The initial vote from the signer's account.
   * @returns The transaction hash.
   */
  async createProposal(
    vaults: (ReadVotingVault | `0x${string}`)[],
    targets: `0x${string}`[],
    calldatas: `0x${string}`[],
    lastCall: bigint,
    ballot: Ballot,
    /**
     * Extra data given to the vaults to help calculation
     */
    extraVaultData?: `0x${string}`[],
    options?: ContractWriteOptions,
  ): Promise<`0x${string}`> {
    const vaultAddresses = vaults.map((vault) =>
      typeof vault === "string" ? vault : vault.address,
    );
    const hash = await this._contract.write(
      "proposal",
      {
        ballot: BALLOTS.indexOf(ballot),
        calldatas,
        extraVaultData: extraVaultData || [],
        lastCall,
        targets,
        votingVaults: vaultAddresses,
      },
      options,
    );
    this._contract.clearCache();
    return hash;
  }

  /**
   * Change the number of blocks that must be waited before a proposal can be executed.
   * @param signer - An ethers Signer instance for the voter.
   * @param blocks - The number of blocks that must be waited.
   * @returns The transaction hash.
   */
  async setLockDuration(
    signer: Signer,
    blocks: number,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.setLockDuration(signer, blocks, options);
  }

  /**
   * Change whether a vault is approved or not.
   * @param signer - An ethers Signer instance for the voter.
   * @param address -The address of the vault.
   * @param isValid - Whether or not the approved.
   * @returns The transaction hash.
   */
  changeVaultStatus(
    signer: Signer,
    address: string,
    isValid: boolean,
    options?: TransactionOptions,
  ): Promise<string> {
    return this.dataSource.changeVaultStatus(signer, address, isValid, options);
  }
}

const BALLOTS = ["yes", "no", "maybe"] as const;
const EXECUTED_PROPOSAL_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * A valid ballot option.
 * @category Data Sources
 */
export type Ballot = (typeof BALLOTS)[number];
